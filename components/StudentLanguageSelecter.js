import React, { useEffect, useState } from "react";
import { Card, Header, Flag, Icon } from "semantic-ui-react";
import { NavLink, useNavigate } from "react-router-dom";

const StudentLanguageSelecter = ({ languages, languageCodeMap, handleLanguageChange }) => {
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    //fix this implementation
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
    <div style={{ padding: "2em" }}>
      <h2 style={{ textAlign: "center", color: "#58CC02" }}>My Languages...</h2>
      <Card.Group itemsPerRow={4}>
        {languages.map((language) => (
          <Card
            key={language._id}
            onClick={() => handleCardClick(language)}
            style={{
              cursor: selectedLanguages.includes(language.name) ? "pointer" : "not-allowed",
              opacity: selectedLanguages.includes(language.name) ? 1 : 0.3,
              backgroundColor: selectedLanguages.includes(language.name) ? "#ffffff" : "#f2f2f2",
            }}
          >
            <Card.Content
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Flag
                name={languageCodeMap[language.name]}
                style={{ marginBottom: "10px", fontSize: "4rem" }}
              />
              <Header as="h3">{language.name}</Header>
              <Icon
                name={selectedLanguages.includes(language.name) ? "unlock alternate" : "lock"}
                color={selectedLanguages.includes(language.name) ? "green" : "red"}
                style={{ marginTop: "10px" }}
              />
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </div>
  );
};

export default StudentLanguageSelecter;
