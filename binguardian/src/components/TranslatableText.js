import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';

function TranslatableText({ children, className }) {
  const { translateText, currentLanguage, isLoading } = useTranslation();
  const [translatedText, setTranslatedText] = useState(children);

  useEffect(() => {
    let isMounted = true;

    const translate = async () => {
      if (typeof children === 'string') {
        const result = await translateText(children);
        if (isMounted) {
          setTranslatedText(result);
        }
      }
    };

    if (currentLanguage !== 'en') {
      translate();
    } else {
      setTranslatedText(children);
    }

    return () => {
      isMounted = false;
    };
  }, [children, currentLanguage, translateText]);

  return (
    <span className={className}>
      {translatedText}
      {isLoading && currentLanguage !== 'en' && ' (translating...)'}
    </span>
  );
}

export default TranslatableText; 