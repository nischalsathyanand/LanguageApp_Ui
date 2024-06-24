import React, { createContext, useState, useEffect } from 'react';

// Create a context
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  // Load the selected language from localStorage on mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
      setSelectedLanguage(JSON.parse(storedLanguage));
    }
  }, []);

  // Save the selected language to localStorage whenever it changes
  useEffect(() => {
    if (selectedLanguage) {
      localStorage.setItem('selectedLanguage', JSON.stringify(selectedLanguage));
    }
  }, [selectedLanguage]);

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
