import React from 'react';
import './MunicipalityDashboard.css';

function MunicipalityDashboard() {
    return (
        <div className="municipality-container">
            <h1>Municipality Dashboard</h1>
            <p>Admin access required. This dashboard allows municipal workers to track reports and optimize waste collection.</p>

            <div className="admin-login">
                <h2>Admin Login Required</h2>
                <p>Please login with your municipal credentials to access this dashboard.</p>
                <button className="login-btn">Login as Administrator</button>
            </div>
        </div>
    );
}

export default MunicipalityDashboard; 