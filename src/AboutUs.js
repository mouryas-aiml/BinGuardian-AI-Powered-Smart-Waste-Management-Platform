import React from 'react';
import './AboutUs.css';
import Earth3D from './components/Earth3D';

function AboutUs() {
    return (
        <div className="about-container">
            <div className="about-header">
                <h1>About BinGuardian</h1>
                <p className="subtitle">Working towards a cleaner, greener future</p>
            </div>

            <div className="about-section">
                <h2>Our Mission</h2>
                <p>
                    BinGuardian aims to revolutionize waste management through technology,
                    community engagement, and data-driven solutions. We believe that proper
                    waste management is essential for sustainable communities and a healthier planet.
                </p>
            </div>

            <div className="about-section">
                <h2>Sustainability Goals</h2>
                <div className="goals-grid">
                    <div className="goal-card">
                        <h3>Reduce Landfill Waste</h3>
                        <p>Aim to reduce landfill-bound waste by 30% through improved sorting and recycling.</p>
                    </div>
                    <div className="goal-card">
                        <h3>Community Participation</h3>
                        <p>Engage 50,000 citizens in active waste reporting and management by 2023.</p>
                    </div>
                    <div className="goal-card">
                        <h3>Collection Efficiency</h3>
                        <p>Optimize collection routes to reduce fuel consumption and emissions by 25%.</p>
                    </div>
                    <div className="goal-card">
                        <h3>Waste Education</h3>
                        <p>Provide comprehensive waste segregation education to all registered users.</p>
                    </div>
                </div>
            </div>

            <div className="about-section">
                <h2>Our Partners</h2>
                <div className="partners-grid">
                    <div className="partner-card">
                        <h3>City Municipality</h3>
                        <p>Official partner for implementing waste management solutions citywide.</p>
                    </div>
                    <div className="partner-card">
                        <h3>EcoTech Solutions</h3>
                        <p>Technology partner providing AI-based waste classification systems.</p>
                    </div>
                    <div className="partner-card">
                        <h3>Green Earth NGO</h3>
                        <p>Collaboration for community education and sustainable practices.</p>
                    </div>
                    <div className="partner-card">
                        <h3>Recycle Co.</h3>
                        <p>Handling collected recyclable materials and promoting circular economy.</p>
                    </div>
                </div>
            </div>

            <div className="global-impact">
                <h2>Our Global Impact</h2>
                <Earth3D />
                <p>BinGuardian is making a difference in waste management worldwide.</p>
            </div>
        </div>
    );
}

export default AboutUs; 