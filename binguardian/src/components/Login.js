import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useTranslation } from '../context/TranslationContext';
import TranslatableText from './TranslatableText';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
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
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            // Sign in with Firebase Authentication
            await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            console.log("User logged in successfully!");
            setLoading(false);

            // Redirect to home page after successful login
            navigate('/');

        } catch (error) {
            setLoading(false);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                setError('Invalid email or password');
            } else if (error.code === 'auth/invalid-email') {
                setError('Invalid email address');
            } else if (error.code === 'auth/too-many-requests') {
                setError('Too many failed login attempts. Please try again later');
            } else {
                setError('An error occurred during login. Please try again');
                console.error(error);
            }
        }
    };

    const handleForgotPassword = async () => {
        if (!formData.email) {
            setError('Please enter your email address first');
            return;
        }

        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, formData.email);
            setMessage('Password reset email sent! Check your inbox.');
            setError('');
        } catch (error) {
            console.error("Error sending password reset email:", error);
            setError('Failed to send password reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className="auth-image">
                    <div className="auth-image-content">
                        <h2>Welcome Back!</h2>
                        <p>Join us in making our community cleaner and greener.</p>
                    </div>
                </div>
                <div className="auth-card">
                    <h2>Login to BinGuardian</h2>
                    <p className="auth-subtitle">Access your waste management dashboard</p>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
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
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group remember-me">
                            <div className="checkbox-wrapper">
                                <input type="checkbox" id="remember" name="remember" />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            <button type="button" className="forgot-password" onClick={handleForgotPassword}>Forgot Password?</button>
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="signup-prompt">
                        <p><TranslatableText>Don't have an account?</TranslatableText></p>
                        <Link to="/signup" className="signup-link">
                            <TranslatableText>Create Account</TranslatableText>
                        </Link>
                    </div>

                    {message && <div className="success-message">{message}</div>}
                </div>
            </div>
        </div>
    );
}

export default Login; 