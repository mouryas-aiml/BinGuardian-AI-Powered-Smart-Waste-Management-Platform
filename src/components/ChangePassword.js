import React, { useState } from 'react';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import './ChangePassword.css';
import { useTranslation } from '../context/TranslationContext';
import TranslatableText from './TranslatableText';

function ChangePassword({ onClose }) {
    const { translateText } = useTranslation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const auth = getAuth();
    const user = auth.currentUser;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset states
        setError('');
        setSuccess(false);

        // Validate inputs
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password should be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            // Re-authenticate user before changing password
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );

            await reauthenticateWithCredential(user, credential);

            // Update password
            await updatePassword(user, newPassword);

            setSuccess(true);

            // Clear form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Close modal after 2 seconds on success
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (error) {
            console.error("Error changing password:", error);

            if (error.code === 'auth/wrong-password') {
                setError('Current password is incorrect');
            } else {
                setError(`Failed to change password: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="change-password-modal">
                <div className="modal-header">
                    <h2><TranslatableText>Change Password</TranslatableText></h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                {success ? (
                    <div className="success-message">
                        <p><TranslatableText>Password changed successfully!</TranslatableText></p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="currentPassword"><TranslatableText>Current Password</TranslatableText></label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword"><TranslatableText>New Password</TranslatableText></label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength="6"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword"><TranslatableText>Confirm New Password</TranslatableText></label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength="6"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="cancel-button" onClick={onClose}>
                                <TranslatableText>Cancel</TranslatableText>
                            </button>
                            <button type="submit" className="submit-button" disabled={loading}>
                                {loading ? <TranslatableText>Updating...</TranslatableText> : <TranslatableText>Change Password</TranslatableText>}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ChangePassword; 