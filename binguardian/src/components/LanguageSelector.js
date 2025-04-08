import React from 'react';
import { useTranslation } from '../context/TranslationContext';
import './LanguageSelector.css';

function LanguageSelector() {
    const { currentLanguage, changeLanguage, isLoading, translatePage } = useTranslation();

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Español' },
        { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' },
        { code: 'hi', name: 'हिन्दी' },
        { code: 'kn', name: 'ಕನ್ನಡ' },
        { code: 'zh', name: '中文' },
        { code: 'ja', name: '日本語' },
        { code: 'ar', name: 'العربية' },
        { code: 'ru', name: 'Русский' }
    ];

    return (
        <div className="language-control-group">
            <div className="language-selector">
                <select
                    value={currentLanguage}
                    onChange={(e) => changeLanguage(e.target.value)}
                    disabled={isLoading}
                >
                    {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>

            {currentLanguage !== 'en' && (
                <button
                    className="navbar-translate-button"
                    onClick={translatePage}
                    disabled={isLoading}
                >
                    {isLoading ? 'Translating...' : '🌐 Translate'}
                </button>
            )}
        </div>
    );
}

export default LanguageSelector; 