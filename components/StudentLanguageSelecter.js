import React, { useEffect, useState } from "react";
import { Card, Icon } from "semantic-ui-react";
import ReactCountryFlag from "react-country-flag";

const StudentLanguageSelecter = ({ languages, languageCodeMap, handleLanguageChange }) => {
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  useEffect(() => {
    const storedLanguages = sessionStorage.getItem('languages');
    if (storedLanguages) {
      setSelectedLanguages(JSON.parse(storedLanguages));
    }
  }, []);

  const handleCardClick = (language) => {
    if (selectedLanguages.includes(language.name)) {
      handleLanguageChange(language);
    }
  };

  return (
    <div style={{ width: "100vw", position: "relative", height: "auto", backgroundColor: "transparent", padding: "2em", boxShadow: "none" }}>
      <Card.Group itemsPerRow={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "50px" }}>
        {languages.map((language) => (
          <Card
            key={language._id}
            onClick={() => handleCardClick(language)}
            style={{
              cursor: selectedLanguages.includes(language.name) ? "pointer" : "not-allowed",
              opacity: selectedLanguages.includes(language.name) ? 1 : 0.3,
              backgroundColor: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              width: "23%", // Ensures card width adapts to its container
              paddingBottom: "15%", // This ensures a square aspect ratio
              position: "relative", // Needed for the content wrapper
              boxShadow: "none"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card.Content
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  height: '100%'
                }}
              >
                <ReactCountryFlag
                  countryCode={languageCodeMap[language.name]}
                  svg
                  style={{
                    width: '50%',
                    height: '50%',
                    marginBottom: '5px'
                  }}
                />
                <h3 style={{ margin: '0px', padding: '0px',color:'#ffff' }}>{language.name}</h3>
                <Icon
                  name={selectedLanguages.includes(language.name) ? "unlock alternate" : "lock"}
                  color={selectedLanguages.includes(language.name) ? "green" : "red"}
                  style={{ marginTop: "10px" }}
                />
              </Card.Content>
            </div>
          </Card>
        ))}
      </Card.Group>
    </div>
  );
};

export default StudentLanguageSelecter;
