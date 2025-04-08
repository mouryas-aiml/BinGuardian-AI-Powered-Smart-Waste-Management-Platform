import React, { useState } from 'react';
import { useTranslation } from '../context/TranslationContext';
import './ApiKeySettings.css';

function ApiKeySettings() {
    const { apiKey, setTranslationApiKey } = useTranslation();
    const [newApiKey, setNewApiKey] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newApiKey.trim()) {
            setTranslationApiKey(newApiKey.trim());
            setNewApiKey('');
            setIsOpen(false);
            alert('API key updated successfully. Try translating again.');
        }
    };

    return (
        <div className="api-key-settings">
            <button
                className="api-key-settings-button"
                onClick={() => setIsOpen(!isOpen)}
                title="Update Translation API Key"
            >
                ⚙️
            </button>

            {isOpen && (
                <div className="api-key-modal">
                    <div className="api-key-modal-content">
                        <h3>Update Translation API Key</h3>
                        <p>Your current API key might have expired or reached its quota limit.</p>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="apiKey">New Google Translation API Key:</label>
                                <input
                                    type="text"
                                    id="apiKey"
                                    value={newApiKey}
                                    onChange={(e) => setNewApiKey(e.target.value)}
                                    placeholder="Enter new API key"
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
                                <button type="submit">Update Key</button>
                            </div>
                        </form>
                        <p className="api-key-help">
                            To get a new API key, visit the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ApiKeySettings; 