import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../context/TranslationContext';
import TranslatableText from './TranslatableText';

function Navbar() {
    const { currentUser, userDetails } = useAuth();
    const navigate = useNavigate();
    const { isLoading } = useTranslation();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const navbarElement = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbarElement.classList.add('scrolled');
            } else {
                navbarElement.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">BinGuardian</Link>
            </div>
            <div className="navbar-links">
                <Link to="/">
                    <TranslatableText>Home</TranslatableText>
                </Link>
                <Link to="/about-us">
                    <TranslatableText>About Us</TranslatableText>
                </Link>
                <Link to="/report-waste">
                    <TranslatableText>Report Waste</TranslatableText>
                </Link>
                <Link to="/recycling-awareness">
                    <TranslatableText>Recycling & Awareness</TranslatableText>
                </Link>
                <Link to="/chatbot">
                    <TranslatableText>Ask BinBot</TranslatableText>
                </Link>

                {userDetails && userDetails.userType === 'municipal' && (
                    <Link to="/municipality-dashboard">
                        <TranslatableText>Admin Dashboard</TranslatableText>
                    </Link>
                )}

                {currentUser ? (
                    <>
                        <Link to="/user-profile">
                            <TranslatableText>My Profile</TranslatableText>
                        </Link>
                        <button onClick={handleLogout} className="auth-link logout">
                            <TranslatableText>Logout</TranslatableText>
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="auth-link">
                            <TranslatableText>Login</TranslatableText>
                        </Link>
                        <Link to="/signup" className="auth-link signup">
                            <TranslatableText>Sign Up</TranslatableText>
                        </Link>
                    </>
                )}

                <LanguageSelector />
                {isLoading && <span className="translating-indicator">Translating...</span>}
            </div>
        </nav>
    );
}

export default Navbar; 