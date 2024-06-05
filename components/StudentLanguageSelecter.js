import React from "react";
import { Card, Header, Flag, Icon } from "semantic-ui-react";

const StudentLanguageSelecter = ({ languages, languageCodeMap, handleLanguageChange }) => {
  const handleCardClick = (language) => {
    // Call handleLanguageChange with the selected language
    handleLanguageChange(language);
  };

  return (
    <div style={{ padding: "2em" }}>
      <Header as="h2" style={{ marginBottom: "1em" }}>
        Languages I need to learn
      </Header>
      <Card.Group itemsPerRow={4}>
        {languages.map((language) => (
          <Card key={language._id} onClick={() => handleCardClick(language)}>
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
                name="unlock alternate"
                color="green"
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
