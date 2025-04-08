import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import { useAuth } from './context/AuthContext';
import EditProfile from './components/EditProfile';
import ChangePassword from './components/ChangePassword';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { useTranslation } from './context/TranslationContext';
import TranslatableText from './components/TranslatableText';
import { FaAward, FaMapMarkerAlt, FaRecycle, FaCheckCircle, FaUserCircle } from 'react-icons/fa';

function UserProfile() {
    const { currentUser, userDetails } = useAuth();
    const { translateText } = useTranslation();
    const [userStats, setUserStats] = useState({
        points: 0,
        totalReports: 0,
        resolvedReports: 0,
        recyclableWaste: 0,
        rewards: [],
        rank: "Beginner", // Default rank
    });
    const [loading, setLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    useEffect(() => {
        const fetchUserStats = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);

                // Get user details from Firestore
                const userRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();

                    // Get reports from the reports collection
                    const reportsQuery = query(
                        collection(db, "reports"),
                        where("userId", "==", currentUser.uid)
                    );
                    const reportsSnap = await getDocs(reportsQuery);

                    // Count total reports and other stats
                    let totalReports = 0;
                    let resolvedReports = 0;
                    let recyclableWaste = 0;

                    reportsSnap.forEach(doc => {
                        const report = doc.data();
                        totalReports++;

                        if (report.status === 'resolved') {
                            resolvedReports++;
                        }

                        if (report.wasteType === 'recyclable') {
                            recyclableWaste++;
                        }
                    });

                    // Calculate user rank based on points
                    const points = userData.points || 0;
                    let rank = "Beginner";
                    if (points >= 500) {
                        rank = "Waste Warrior";
                    } else if (points >= 200) {
                        rank = "Eco Champion";
                    } else if (points >= 100) {
                        rank = "Green Guardian";
                    } else if (points >= 50) {
                        rank = "Recycling Enthusiast";
                    }

                    // Mock rewards data - in a real app, this would come from a rewards system
                    const rewards = [
                        { id: 1, name: "First Report", achieved: totalReports > 0 },
                        { id: 2, name: "5 Reports Submitted", achieved: totalReports >= 5 },
                        { id: 3, name: "Recycling Hero", achieved: recyclableWaste >= 3 },
                        { id: 4, name: "Problem Solver", achieved: resolvedReports >= 1 },
                        { id: 5, name: "50 Points Club", achieved: points >= 50 },
                        { id: 6, name: "100 Points Milestone", achieved: points >= 100 }
                    ];

                    setUserStats({
                        points: points,
                        totalReports: totalReports,
                        resolvedReports: resolvedReports,
                        recyclableWaste: recyclableWaste,
                        rewards: rewards,
                        rank: rank
                    });

                    // Set avatar URL if exists
                    if (userData.avatarUrl) {
                        setAvatarUrl(userData.avatarUrl);
                    }
                }
            } catch (error) {
                console.error("Error fetching user stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserStats();
    }, [currentUser]);

    // Function to check if password change is available
    const canChangePassword = () => {
        return currentUser && currentUser.providerData &&
            currentUser.providerData.some(provider => provider.providerId === 'password');
    };

    if (!currentUser) {
        return (
            <div className="user-profile-container">
                <p><TranslatableText>Please log in to view your profile.</TranslatableText></p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="user-profile-container">
                <p><TranslatableText>Loading profile...</TranslatableText></p>
            </div>
        );
    }

    return (
        <div className="user-profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="User avatar" />
                    ) : (
                        <FaUserCircle size={80} />
                    )}
                </div>
                <div className="profile-info">
                    <h1>{userDetails?.name || currentUser.email}</h1>
                    <p><TranslatableText>Member since:</TranslatableText> {new Date(userDetails?.createdAt || Date.now()).toLocaleDateString()}</p>
                    <div className="user-rank">
                        <span className="rank-badge">{userStats.rank}</span>
                    </div>
                </div>
            </div>

            <div className="profile-content">
                <div className="stats-section">
                    <h2><TranslatableText>User Statistics</TranslatableText></h2>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon points-icon">
                                <FaAward />
                            </div>
                            <div className="stat-details">
                                <h3><TranslatableText>Points Earned</TranslatableText></h3>
                                <p className="stat-value">{userStats.points}</p>
                                <p className="stat-description">
                                    <TranslatableText>Earn more points by submitting reports and recycling waste</TranslatableText>
                                </p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon reports-icon">
                                <FaMapMarkerAlt />
                            </div>
                            <div className="stat-details">
                                <h3><TranslatableText>Reports Submitted</TranslatableText></h3>
                                <p className="stat-value">{userStats.totalReports}</p>
                                <p className="stat-description">
                                    <TranslatableText>Total waste reports you've submitted</TranslatableText>
                                </p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon recycling-icon">
                                <FaRecycle />
                            </div>
                            <div className="stat-details">
                                <h3><TranslatableText>Recyclable Items</TranslatableText></h3>
                                <p className="stat-value">{userStats.recyclableWaste}</p>
                                <p className="stat-description">
                                    <TranslatableText>Recyclable waste items you've reported</TranslatableText>
                                </p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon resolved-icon">
                                <FaCheckCircle />
                            </div>
                            <div className="stat-details">
                                <h3><TranslatableText>Resolved Reports</TranslatableText></h3>
                                <p className="stat-value">{userStats.resolvedReports}</p>
                                <p className="stat-description">
                                    <TranslatableText>Reports that have been successfully resolved</TranslatableText>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="achievements-section">
                    <h2><TranslatableText>Achievements & Rewards</TranslatableText></h2>
                    <div className="achievements-list">
                        {userStats.rewards.map(reward => (
                            <div
                                key={reward.id}
                                className={`achievement-item ${reward.achieved ? 'achieved' : 'locked'}`}
                            >
                                <div className="achievement-icon">
                                    {reward.achieved ? '🏆' : '🔒'}
                                </div>
                                <div className="achievement-details">
                                    <h3>{reward.name}</h3>
                                    <p>
                                        {reward.achieved ?
                                            <TranslatableText>Completed!</TranslatableText> :
                                            <TranslatableText>Not yet achieved</TranslatableText>}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="user-actions">
                    <h2><TranslatableText>Account Actions</TranslatableText></h2>
                    <div className="action-buttons">
                        <button className="action-button edit-profile" onClick={() => setShowEditProfile(true)}>
                            <TranslatableText>Edit Profile</TranslatableText>
                        </button>
                        {canChangePassword() && (
                            <button
                                className="action-button change-password"
                                onClick={() => setShowChangePassword(true)}
                            >
                                <TranslatableText>Change Password</TranslatableText>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showEditProfile && (
                <EditProfile onClose={() => setShowEditProfile(false)} />
            )}

            {showChangePassword && (
                <ChangePassword onClose={() => setShowChangePassword(false)} />
            )}
        </div>
    );
}

export default UserProfile; 