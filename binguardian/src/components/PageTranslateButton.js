import React from 'react';
import { useTranslation } from '../context/TranslationContext';
import './PageTranslateButton.css';

function PageTranslateButton() {
    const { translatePage, isLoading, currentLanguage } = useTranslation();

    // Only show the button if we're not on English and not already loading a translation
    if (currentLanguage === 'en') return null;

    return (
        <button
            className="page-translate-button"
            onClick={translatePage}
            disabled={isLoading}
        >
            {isLoading ? 'Translating...' : 'Translate This Page'}
        </button>
    );
}

export default PageTranslateButton; 