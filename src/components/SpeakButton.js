import React from 'react';
import { useTTS } from '../context/TTSContext';
import { useTranslation } from '../context/TranslationContext';
import './SpeakButton.css';

const SpeakButton = ({ text }) => {
  const { speak, isLoading } = useTTS();
  const { currentLanguage } = useTranslation();

  const handleSpeak = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    speak(text, currentLanguage);
  };

  return (
    <button
      className="speak-button"
      onClick={handleSpeak}
      disabled={isLoading}
    >
      <i className="fas fa-volume-up"></i> {isLoading ? 'Speaking...' : 'Listen'}
    </button>
  );
};

export default SpeakButton; 