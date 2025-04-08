import React from 'react';
import { useTranslation } from '../context/TranslationContext';
import { FaLanguage, FaSpinner } from 'react-icons/fa';
import './TranslateButton.css';

function TranslateButton() {
  const { currentLanguage, changeLanguage, translatePage, isLoading } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ta', name: 'தமிழ்' }
  ];

  const handleTranslate = (langCode) => {
    changeLanguage(langCode);
    if (langCode !== 'en') {
      setTimeout(() => translatePage(), 300);
    }
  };

  return (
    <>
      <div className="translate-button-container">
        <div className="translate-dropdown">
          <button className="translate-main-button" disabled={isLoading}>
            <FaLanguage /> Translate
          </button>
          <div className="translate-dropdown-content">
            {languages.map(lang => (
              <button
                key={lang.code}
                className={currentLanguage === lang.code ? 'active' : ''}
                onClick={() => handleTranslate(lang.code)}
                disabled={isLoading}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="translation-loading">
          <div className="translation-loading-spinner"></div>
          Translating...
        </div>
      )}
    </>
  );
}

export default TranslateButton; 