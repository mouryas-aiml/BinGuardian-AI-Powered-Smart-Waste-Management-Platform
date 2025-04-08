import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useTranslation } from '../context/TranslationContext';
import TranslatableText from './TranslatableText';

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'citizen'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
        setLoading(true);

        // Basic validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;

            // Store additional user information in Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: formData.name,
                email: formData.email,
                userType: formData.userType,
                createdAt: new Date().toISOString(),
                reports: [],
                points: 0
            });

            console.log("User registered successfully!");
            setLoading(false);

            // Redirect to login page after successful registration
            navigate('/login');

        } catch (error) {
            setLoading(false);
            if (error.code === 'auth/email-already-in-use') {
                setError('Email already in use. Please use a different email or login.');
            } else if (error.code === 'auth/invalid-email') {
                setError('Invalid email address.');
            } else if (error.code === 'auth/weak-password') {
                setError('Password is too weak. Please use a stronger password.');
            } else {
                setError('An error occurred during registration. Please try again.');
                console.error(error);
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className="auth-image signup-image">
                    <div className="auth-image-content">
                        <h2>Join Our Community</h2>
                        <p>Together, we can make a difference in waste management.</p>
                    </div>
                </div>
                <div className="auth-card">
                    <h2>Create an Account</h2>
                    <p className="auth-subtitle">Join our waste management community</p>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <div className="input-with-icon">
                                <i className="icon user-icon"></i>
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
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-with-icon">
                                <i className="icon email-icon"></i>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-with-icon">
                                <i className="icon password-icon"></i>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="input-with-icon">
                                <i className="icon password-icon"></i>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="userType">Account Type</label>
                            <div className="input-with-icon">
                                <i className="icon role-icon"></i>
                                <select
                                    id="userType"
                                    name="userType"
                                    value={formData.userType}
                                    onChange={handleChange}
                                >
                                    <option value="citizen">Citizen</option>
                                    <option value="municipal">Municipal Officer</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group terms">
                            <input type="checkbox" id="terms" name="terms" required />
                            <label htmlFor="terms">
                                I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="login-prompt">
                        <p><TranslatableText>Already have an account?</TranslatableText></p>
                        <Link to="/login" className="login-link">
                            <TranslatableText>Login</TranslatableText>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup; 