import React from "react";
import { Card, Header, Flag, Icon } from "semantic-ui-react";

const StudentLanguageSelecter = ({ languages, languageCodeMap, handleLanguageChange }) => {
  const studentLanguage = sessionStorage.getItem('language');

  const handleCardClick = (language) => {
    if (language.name === studentLanguage) {
      // Call handleLanguageChange with the selected language if it matches the student's language
      handleLanguageChange(language);
    }
  };

  return (
    <div style={{ padding: "2em" }}>
      <h2 style={{textAlign:"center" ,color:"#58CC02"}}>My Languages...</h2>
      <Card.Group itemsPerRow={4}>
        {languages.map((language) => (
          <Card
            key={language._id}
            onClick={() => handleCardClick(language)}
            style={{
              cursor: language.name === studentLanguage ? "pointer" : "not-allowed",
              opacity: language.name === studentLanguage ? 1 : 0.3, // Adjusted opacity for locked languages
              backgroundColor: language.name === studentLanguage ? "#ffffff" : "#f2f2f2", // Adjusted background color for locked languages
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
                name={language.name === studentLanguage ? "unlock alternate" : "lock"}
                color={language.name === studentLanguage ? "green" : "red"}
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
