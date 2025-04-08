import React, { useState, useEffect, useRef } from 'react';
import './ReportWaste.css';
import { useAuth } from './context/AuthContext';
import { doc, updateDoc, arrayUnion, increment, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from './context/TranslationContext';
import TranslatableText from './components/TranslatableText';
import 'leaflet/dist/leaflet.css';

// Fix for marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationMarker({ setPosition }) {
    const [marker, setMarker] = useState(null);
    const map = useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setMarker({ lat, lng });
            setPosition({ lat, lng });
        },
    });

    return marker === null ? null : (
        <Marker position={marker}>
            <Popup>Selected location</Popup>
        </Marker>
    );
}

function ReportWaste() {
    const { currentUser, userDetails, refreshUserData } = useAuth();
    const { translateText } = useTranslation();
    const [formData, setFormData] = useState({
        location: '',
        description: '',
        wasteType: 'general',
        image: null
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    // Map state
    const [position, setPosition] = useState(null);
    const [address, setAddress] = useState('');
    const [userLocation, setUserLocation] = useState([20.5937, 78.9629]); // Default to India
    const mapRef = useRef(null);

    const POINTS_PER_REPORT = 10;

    // Try to get user's location for map centering
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error("Error getting user location:", error);
                }
            );
        }
    }, []);

    // Reverse geocoding to get address from coordinates
    useEffect(() => {
        if (position) {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&addressdetails=1`)
                .then(response => response.json())
                .then(data => {
                    const addressText = data.display_name || `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
                    setAddress(addressText);
                    setFormData(prev => ({
                        ...prev,
                        location: addressText
                    }));
                })
                .catch(error => {
                    console.error("Error fetching address:", error);
                    const fallbackAddress = `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
                    setAddress(fallbackAddress);
                    setFormData(prev => ({
                        ...prev,
                        location: fallbackAddress
                    }));
                });
        }
    }, [position]);

    useEffect(() => {
        // Force map to invalidate size and redraw when component mounts
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 300);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }

            setFormData({
                ...formData,
                image: file
            });

            // Create image preview
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file) => {
        if (!file) return null;

        try {
            const storageRef = ref(storage, `waste_reports/${currentUser.uid}/${uuidv4()}.jpg`);

            // Create upload task to track progress
            const uploadTask = uploadBytesResumable(storageRef, file);

            // Set up progress monitoring
            return new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        // Update progress state
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress(progress);
                    },
                    (error) => {
                        console.error("Upload error:", error);
                        reject(error);
                    },
                    async () => {
                        // Upload complete, get download URL
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    }
                );
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            setError('Please login to submit a report');
            return;
        }

        if (!position) {
            setError('Please select a location on the map');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log("Starting report submission process...");

            // Upload image to Firebase Storage
            let imageUrl = null;
            if (formData.image) {
                console.log("Uploading image...");
                imageUrl = await uploadImage(formData.image);
                console.log("Image uploaded successfully:", imageUrl);
            }

            // Create report object
            const reportId = uuidv4();
            const report = {
                id: reportId,
                location: formData.location,
                coordinates: {
                    latitude: position.lat,
                    longitude: position.lng
                },
                description: formData.description,
                wasteType: formData.wasteType,
                imageUrl: imageUrl,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                userName: userDetails?.name || 'Anonymous'
            };

            console.log("Report object created:", report);

            // First check if user document exists
            const userRef = doc(db, "users", currentUser.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                console.log("User document doesn't exist, creating it...");
                // If user document doesn't exist, create it with initial data
                await setDoc(userRef, {
                    uid: currentUser.uid,
                    name: userDetails?.name || 'User',
                    email: currentUser.email,
                    reports: [report],
                    points: POINTS_PER_REPORT,
                    createdAt: new Date().toISOString()
                });
            } else {
                console.log("User document exists, updating it...");
                // Update user document with new report and increment points
                await updateDoc(userRef, {
                    reports: arrayUnion(report),
                    points: increment(POINTS_PER_REPORT)
                });
            }

            console.log("Database updated successfully");

            // Refresh user data to show updated points
            await refreshUserData();
            console.log("User data refreshed");

            // Show success message
            setSuccess(true);

            // Reset form
            setFormData({
                location: '',
                description: '',
                wasteType: 'general',
                image: null
            });
            setImagePreview(null);
            setPosition(null);
            setAddress('');

            setTimeout(() => {
                setSuccess(false);
            }, 5000);

            // Also add the report to a separate reports collection
            await addDoc(collection(db, "reports"), {
                ...report,
                userId: currentUser.uid,
                userEmail: currentUser.email,
                timestamp: serverTimestamp()
            });

            console.log("Report added to reports collection");

        } catch (error) {
            console.error("Error submitting report:", error);
            setError(`Failed to submit report: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="report-container">
            <div className="report-header">
                <h1><TranslatableText>Report Waste</TranslatableText></h1>
                <p><TranslatableText>Help keep our community clean by reporting uncollected waste</TranslatableText></p>
            </div>

            {!currentUser && (
                <div className="login-prompt">
                    <p><TranslatableText>Please <a href="/login">login</a> to submit waste reports and earn points!</TranslatableText></p>
                </div>
            )}

            {error && <div className="report-error">{error}</div>}
            {success && (
                <div className="report-success">
                    <p><TranslatableText>Report submitted successfully! You earned {POINTS_PER_REPORT} points.</TranslatableText></p>
                    <p><TranslatableText>Current points: {userDetails?.points || 0}</TranslatableText></p>
                </div>
            )}

            <div className="report-content">
                <div className="map-container">
                    <MapContainer
                        center={userLocation}
                        zoom={5}
                        scrollWheelZoom={true}
                        style={{ height: '600px', width: '100%', borderRadius: '10px' }}
                        className="leaflet-map"
                        ref={mapRef}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker setPosition={setPosition} />
                    </MapContainer>
                    <div className="map-instructions">
                        <p><TranslatableText>Click on the map to select the waste location</TranslatableText></p>
                        {position && (
                            <p className="selected-location">
                                <TranslatableText>Selected:</TranslatableText> {address || `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`}
                            </p>
                        )}
                    </div>
                </div>

                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="location"><TranslatableText>Location</TranslatableText></label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Select location on map or enter address"
                                required
                                disabled={loading || !currentUser}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description"><TranslatableText>Description</TranslatableText></label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the waste issue"
                                rows="4"
                                required
                                disabled={loading || !currentUser}
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="wasteType"><TranslatableText>Waste Type</TranslatableText></label>
                            <select
                                id="wasteType"
                                name="wasteType"
                                value={formData.wasteType}
                                onChange={handleChange}
                                required
                                disabled={loading || !currentUser}
                            >
                                <option value="general"><TranslatableText>General Waste</TranslatableText></option>
                                <option value="recyclable"><TranslatableText>Recyclable</TranslatableText></option>
                                <option value="organic"><TranslatableText>Organic</TranslatableText></option>
                                <option value="hazardous"><TranslatableText>Hazardous</TranslatableText></option>
                                <option value="electronic"><TranslatableText>Electronic</TranslatableText></option>
                                <option value="construction"><TranslatableText>Construction Debris</TranslatableText></option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="image"><TranslatableText>Upload Image</TranslatableText></label>
                            <div className="file-input-container">
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    required
                                    disabled={loading || !currentUser}
                                />
                                {imagePreview && (
                                    <div className="image-preview">
                                        <img src={imagePreview} alt="Preview" />
                                    </div>
                                )}
                                <p className="ai-note"><TranslatableText>Our AI will analyze your image to classify the waste type</TranslatableText></p>
                            </div>
                        </div>

                        {loading && uploadProgress > 0 && (
                            <div className="upload-progress">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <p>{Math.round(uploadProgress)}% uploaded</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading || !currentUser || !position}
                        >
                            {loading ? <TranslatableText>Submitting...</TranslatableText> : <TranslatableText>Submit Report</TranslatableText>}
                        </button>

                        {currentUser && (
                            <div className="points-info">
                                <p><TranslatableText>You'll earn {POINTS_PER_REPORT} points for this report!</TranslatableText></p>
                                <p><TranslatableText>Current points: {userDetails?.points || 0}</TranslatableText></p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ReportWaste; 