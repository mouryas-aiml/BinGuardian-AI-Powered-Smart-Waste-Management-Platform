import React, { useState } from 'react';
import { useTranslation } from '../context/TranslationContext';
import './TranslationApiSetup.css';

function TranslationApiSetup() {
  const { apiKey, setTranslationApiKey } = useTranslation();
  const [showInput, setShowInput] = useState(false);
  const [inputKey, setInputKey] = useState(apiKey);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTranslationApiKey(inputKey);
    setShowInput(false);
  };

  return (
    <div className="translation-api-setup">
      {!showInput ? (
        <button
          className="setup-button configured"
          onClick={() => setShowInput(true)}
        >
          Translation API Configured ✓
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="api-key-form">
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Enter Google Translation API Key"
          />
          <button type="submit">Save</button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => setShowInput(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default TranslationApiSetup; 