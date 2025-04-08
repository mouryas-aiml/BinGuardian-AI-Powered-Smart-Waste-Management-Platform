import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserHomeScreen.css';
import { useAuth } from './context/AuthContext';
import { FaRecycle, FaLeaf, FaRobot, FaInfoCircle, FaMapMarkerAlt, FaTrophy } from 'react-icons/fa';

function UserHomeScreen() {
    const { currentUser, userDetails } = useAuth();

    const stats = {
        reportsSubmitted: userDetails?.reports?.length || 0,
        reportsResolved: userDetails?.reports?.filter(report => report.status === 'resolved')?.length || 0,
        recyclingProgress: 78, // This would be calculated based on user's recycling activity
        pointsEarned: userDetails?.points || 0
    };

    useEffect(() => {
        const createParticles = () => {
            const particlesContainer = document.querySelector('.particles-container');
            if (!particlesContainer) return;

            particlesContainer.innerHTML = '';

            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');

                const size = Math.random() * 30 + 10;
                const posX = Math.random() * 100;
                const posY = Math.random() * 100;
                const animDuration = Math.random() * 15 + 10;
                const animDelay = Math.random() * 5;
                const opacity = Math.random() * 0.5 + 0.1;

                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${posX}%`;
                particle.style.top = `${posY}%`;
                particle.style.animationDuration = `${animDuration}s`;
                particle.style.animationDelay = `${animDelay}s`;
                particle.style.opacity = opacity;

                particlesContainer.appendChild(particle);
            }
        };

        createParticles();
        window.addEventListener('resize', createParticles);

        return () => {
            window.removeEventListener('resize', createParticles);
        };
    }, []);

    return (
        <div className="user-home-container">
            <div className="animated-background">
                <div className="particles-container"></div>
                <div className="gradient-overlay"></div>
            </div>
            <div className="home-container">
                <div className="hero-section">
                    <div className="hero-content">
                        <h1>{currentUser ? `Welcome, ${userDetails?.name || 'User'}!` : 'Welcome to BinGuardian!'}</h1>
                        <p className="hero-subtitle">Together, we can make our community cleaner and greener</p>

                        {!currentUser && (
                            <div className="welcome-buttons">
                                <Link to="/login" className="welcome-button login">Login</Link>
                                <Link to="/signup" className="welcome-button signup">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>

                {currentUser && (
                    <div className="dashboard">
                        <h2 className="section-title"><FaTrophy className="section-icon" /> Your Impact Dashboard</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon recycling">
                                    <FaRecycle />
                                </div>
                                <h3>Reports Submitted</h3>
                                <p className="stat-number">{stats.reportsSubmitted}</p>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon resolved">
                                    <FaLeaf />
                                </div>
                                <h3>Reports Resolved</h3>
                                <p className="stat-number">{stats.reportsResolved}</p>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon progress">
                                    <div className="progress-circle">
                                        <div className="progress-inner">{stats.recyclingProgress}%</div>
                                    </div>
                                </div>
                                <h3>Recycling Progress</h3>
                                <p className="stat-number">{stats.recyclingProgress}%</p>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon points">
                                    <FaTrophy />
                                </div>
                                <h3>Points Earned</h3>
                                <p className="stat-number">{stats.pointsEarned}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="features-section">
                    <h2 className="section-title">Quick Actions</h2>
                    <div className="features-grid">
                        <Link to="/report-waste" className="feature-card">
                            <div className="feature-icon report">
                                <FaMapMarkerAlt />
                            </div>
                            <h3>Report Garbage</h3>
                            <p>Report waste issues in your area and earn points</p>
                        </Link>

                        <Link to="/chatbot" className="feature-card">
                            <div className="feature-icon chatbot">
                                <FaRobot />
                            </div>
                            <h3>Ask BinBot</h3>
                            <p>Get answers to all your waste management questions</p>
                        </Link>

                        <Link to="/recycling-awareness" className="feature-card">
                            <div className="feature-icon recycling">
                                <FaRecycle />
                            </div>
                            <h3>Recycling Guide</h3>
                            <p>Learn how to properly recycle different materials</p>
                        </Link>

                        <Link to="/about-us" className="feature-card">
                            <div className="feature-icon about">
                                <FaInfoCircle />
                            </div>
                            <h3>About Us</h3>
                            <p>Learn about our mission and sustainability goals</p>
                        </Link>
                    </div>
                </div>

                <div className="recent-reports-section">
                    <h2 className="section-title">Recent Community Reports</h2>
                    <div className="reports-grid">
                        <div className="report-card">
                            <div className="report-image pending"></div>
                            <div className="report-content">
                                <h3>City Park, North Entrance</h3>
                                <p className="report-date">April 2, 2024</p>
                                <p className="report-status pending">Pending</p>
                            </div>
                        </div>

                        <div className="report-card">
                            <div className="report-image resolved"></div>
                            <div className="report-content">
                                <h3>Main Street, Downtown</h3>
                                <p className="report-date">April 1, 2024</p>
                                <p className="report-status resolved">Resolved</p>
                            </div>
                        </div>

                        <div className="report-card">
                            <div className="report-image in-progress"></div>
                            <div className="report-content">
                                <h3>Riverside Walk</h3>
                                <p className="report-date">March 31, 2024</p>
                                <p className="report-status in-progress">In Progress</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserHomeScreen;
