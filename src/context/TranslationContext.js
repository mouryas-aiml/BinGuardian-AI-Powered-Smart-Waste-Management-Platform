import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('AIzaSyCWU4fpR6WYAjDPMx8w4aAHxcNDdNMq1XY');
  const location = useLocation();

  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    // Store the new API key in localStorage
    localStorage.setItem('translationApiKey', apiKey);
  }, []);

  // Auto-change language for home page every 30 seconds
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/home') {
      const languages = ['en', 'kn', 'hi', 'ta'];
      const interval = setInterval(() => {
        setCurrentLanguage(prevLang => {
          const currentIndex = languages.indexOf(prevLang);
          const nextIndex = (currentIndex + 1) % languages.length;
          const newLang = languages[nextIndex];
          localStorage.setItem('preferredLanguage', newLang);

          // If changing to non-English, translate after a short delay
          if (newLang !== 'en') {
            setTimeout(() => translatePage(), 500);
          } else {
            // If changing to English, reload the page to reset content
            window.location.reload();
          }

          return newLang;
        });
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [location.pathname]);

  const setTranslationApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('translationApiKey', key);
  };

  // Improved function to translate all text nodes in the page
  const translatePage = async () => {
    if (currentLanguage === 'en') return;

    setIsLoading(true);
    console.log(`Translating page to ${currentLanguage}...`);

    try {
      // Get all text nodes in the document
      const textNodes = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function (node) {
            // Skip nodes that shouldn't be translated
            if (
              node.parentNode.nodeName === 'SCRIPT' ||
              node.parentNode.nodeName === 'STYLE' ||
              node.parentNode.nodeName === 'SELECT' ||
              node.parentNode.nodeName === 'OPTION' ||
              node.textContent.trim() === '' ||
              node.parentNode.classList.contains('no-translate') ||
              node.parentNode.hasAttribute('data-no-translate')
            ) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.textContent.trim()) {
          // Don't translate content that's too short or just numbers
          const text = node.textContent.trim();
          if (text.length > 1 && !/^\d+$/.test(text)) {
            textNodes.push(node);
          }
        }
      }

      // Batch translate to reduce API calls
      const textsToTranslate = textNodes.map(node => node.textContent.trim())
        .filter(text => text.length > 0);

      if (textsToTranslate.length === 0) return;

      // Test API with a single query first
      try {
        const testResponse = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: ["Test translation"],
            target: currentLanguage,
            format: 'text'
          })
        });

        if (!testResponse.ok) {
          const errorData = await testResponse.json();
          console.error("Translation API test failed:", errorData);

          // Show user-friendly error message
          const errorMessage = errorData?.error?.message || 'Unknown error';
          alert(`Translation failed: ${errorMessage}. API key may have expired or reached its quota.`);

          return;
        }
      } catch (error) {
        console.error('Translation API test failed:', error);
        alert('Translation service is currently unavailable. Please try again later.');
        return;
      }

      // Continue with batch translation if the test passed
      const batchSize = 50;
      for (let i = 0; i < textsToTranslate.length; i += batchSize) {
        const batch = textsToTranslate.slice(i, i + batchSize);

        // Log for debugging
        console.log(`Translating batch ${i / batchSize + 1} of ${Math.ceil(textsToTranslate.length / batchSize)}`);

        try {
          const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              q: batch,
              target: currentLanguage,
              format: 'text'
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Translation API error:", errorData);
            throw new Error(`Translation failed: ${errorData?.error?.message || 'Unknown error'}`);
          }

          const data = await response.json();
          const translatedTexts = data.data.translations.map(t => t.translatedText);

          // Update the text nodes with translated content
          for (let j = 0; j < translatedTexts.length; j++) {
            const nodeIndex = i + j;
            if (nodeIndex < textNodes.length) {
              textNodes[nodeIndex].textContent = translatedTexts[j];
            }
          }
        } catch (error) {
          console.error('Translation batch failed:', error);
          // Continue with next batch instead of failing completely
        }

        // Add a small delay between batches to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error('Page translation error:', error);
      alert('Translation failed. Please try again later.');
    } finally {
      setIsLoading(false);
      console.log('Translation completed');
    }
  };

  const translateText = (text) => {
    if (!text || currentLanguage === 'en') return text;
    if (!translations[text]) return text;
    return translations[text];
  };

  // Function to speak text in the current language
  const speakInLanguage = (text) => {
    if (!text) return;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage;

      // Load and select voices
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();

        // Try to find specific voices for our supported languages
        let voice;

        switch (currentLanguage) {
          case 'hi':
            voice = voices.find(v => v.lang.startsWith('hi'));
            break;
          case 'kn':
            voice = voices.find(v => v.lang.startsWith('kn') || v.lang.includes('kannada'));
            break;
          case 'ta':
            voice = voices.find(v => v.lang.startsWith('ta') || v.lang.includes('tamil'));
            break;
          default:
            voice = voices.find(v => v.lang.startsWith('en-'));
        }

        // If no matching voice is found, try to use any available Indian voice as fallback
        if (!voice && ['hi', 'kn', 'ta'].includes(currentLanguage)) {
          voice = voices.find(v => v.lang.startsWith('hi'));
        }

        if (voice) {
          utterance.voice = voice;
        }

        window.speechSynthesis.speak(utterance);
      };

      // Check if voices are already loaded
      if (speechSynthesis.getVoices().length) {
        setVoice();
      } else {
        // Wait for voices to be loaded
        speechSynthesis.onvoiceschanged = setVoice;
      }
    } else {
      console.error('Text-to-speech not supported in this browser');
    }
  };

  const changeLanguage = (langCode) => {
    if (langCode === currentLanguage) return;

    setCurrentLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);

    if (langCode === 'en') {
      // If switching to English, reload the page to get original content
      window.location.reload();
    }
    // Translation will be handled by the calling component
  };

  return (
    <TranslationContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        translateText,
        translatePage,
        speakInLanguage,
        isLoading,
        apiKey,
        setTranslationApiKey
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext); 