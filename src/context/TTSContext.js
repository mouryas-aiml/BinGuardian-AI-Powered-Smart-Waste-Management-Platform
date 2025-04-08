import React, { createContext, useState, useContext, useEffect } from 'react';

const TTSContext = createContext();

export const TTSProvider = ({ children }) => {
    const [apiKey, setApiKey] = useState('AIzaSyBtc2ZGWzBFGn5jyF8Gqj-pw7h2rgW64OI');
    const [isLoading, setIsLoading] = useState(false);

    // Add language mapping for proper TTS voices
    const languageVoiceMap = {
        'en': { languageCode: 'en-US', name: 'en-US-Neural2-F', ssmlGender: 'FEMALE' },
        'hi': { languageCode: 'hi-IN', name: 'hi-IN-Neural2-A', ssmlGender: 'FEMALE' },
        'kn': { languageCode: 'kn-IN', name: 'kn-IN-Standard-A', ssmlGender: 'FEMALE' },
        'ta': { languageCode: 'ta-IN', name: 'ta-IN-Standard-A', ssmlGender: 'FEMALE' }
    };

    useEffect(() => {
        // Store API key in localStorage
        localStorage.setItem('ttsApiKey', apiKey);
    }, [apiKey]);

    const speak = async (text, language = 'en') => {
        if (!text) return;

        setIsLoading(true);
        console.log(`Speaking in ${language}:`, text);

        try {
            // Get the voice configuration for the requested language
            const voiceConfig = languageVoiceMap[language] || languageVoiceMap['en'];

            // Using Google Cloud Text-to-Speech API
            const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input: { text },
                    voice: {
                        languageCode: voiceConfig.languageCode,
                        name: voiceConfig.name,
                        ssmlGender: voiceConfig.ssmlGender
                    },
                    audioConfig: { audioEncoding: 'MP3' }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('TTS API error:', errorData);
                // Fallback to browser TTS
                fallbackSpeak(text, language);
                return;
            }

            const data = await response.json();
            const audioContent = data.audioContent;

            // Play the audio
            const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
            audio.play();

            // Set event listener to detect when audio finishes playing
            audio.onended = () => {
                setIsLoading(false);
            };

        } catch (error) {
            console.error('TTS error:', error);
            // Fallback to browser TTS
            fallbackSpeak(text, language);
        }
    };

    // Fallback to browser's built-in TTS if Google API fails
    const fallbackSpeak = (text, language = 'en') => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);

            // Map our language codes to BCP 47 language tags for browser TTS
            const langMap = {
                'en': 'en-US',
                'hi': 'hi-IN',
                'kn': 'kn-IN',
                'ta': 'ta-IN'
            };

            utterance.lang = langMap[language] || 'en-US';

            // Load voices for the correct language if available
            const voices = window.speechSynthesis.getVoices();
            const voiceForLanguage = voices.find(voice => voice.lang.startsWith(utterance.lang));

            if (voiceForLanguage) {
                utterance.voice = voiceForLanguage;
            }

            // Set up event handlers
            utterance.onend = () => {
                setIsLoading(false);
            };

            utterance.onerror = (error) => {
                console.error('Speech synthesis error:', error);
                setIsLoading(false);
            };

            window.speechSynthesis.speak(utterance);
        } else {
            console.error('Text-to-speech not supported in this browser');
            setIsLoading(false);
        }
    };

    const setTTSApiKey = (key) => {
        setApiKey(key);
        localStorage.setItem('ttsApiKey', key);
    };

    return (
        <TTSContext.Provider
            value={{
                speak,
                isLoading,
                apiKey,
                setTTSApiKey
            }}
        >
            {children}
        </TTSContext.Provider>
    );
};

export const useTTS = () => useContext(TTSContext); 