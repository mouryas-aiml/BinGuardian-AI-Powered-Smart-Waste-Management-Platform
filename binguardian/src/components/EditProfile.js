import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function EditProfile({ onClose }) {
    const { userDetails, currentUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        bio: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (userDetails) {
            setFormData({
                name: userDetails.name || '',
                email: userDetails.email || '',
                phone: userDetails.phone || '',
                address: userDetails.address || '',
                bio: userDetails.bio || ''
            });
        }
    }, [userDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        if (!formData.name) {
            setError('Name cannot be empty');
            setLoading(false);
            return;
        }

        try {
            const userDoc = doc(db, "users", currentUser.uid);

            await updateDoc(userDoc, {
                name: formData.name,
                phone: formData.phone || null,
                address: formData.address || null,
                bio: formData.bio || null,
                updatedAt: new Date().toISOString()
            });

            setSuccess(true);
            setLoading(false);

            // Wait for 2 seconds to show success message before closing
            setTimeout(() => {
                onClose();
                // Refresh the page to show updated data
                window.location.reload();
            }, 2000);

        } catch (error) {
            setLoading(false);
            setError('Failed to update profile. Please try again.');
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="edit-profile-overlay">
            <div className="edit-profile-modal">
                <div className="edit-profile-header">
                    <h2>Edit Profile</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>

                {error && <div className="edit-profile-error">{error}</div>}
                {success && <div className="edit-profile-success">Profile updated successfully!</div>}

                <form onSubmit={handleSubmit} className="edit-profile-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email (Cannot be changed)</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="disabled-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            placeholder="Enter your address"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio || ''}
                            onChange={handleChange}
                            placeholder="Tell us a bit about yourself"
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="edit-profile-buttons">
                        <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
                        <button
                            type="submit"
                            className="save-button"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfile; 