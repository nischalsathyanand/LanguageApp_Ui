import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Header,
  Step,
  StepContent,
  StepGroup,
  Icon,
  Menu,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Loader,
  Flag,
} from "semantic-ui-react";
import { useLocation } from "react-router-dom";
import StudentContent from "./StudentContent";
import { useNavigate } from "react-router-dom";

const StudentHome = () => {
  const location = useLocation();
  const username = location.state?.username || "Default Username";
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [loadingLanguages, setLoadingLanguages] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/languages");
        const data = await response.json();
        setLanguages(data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      } finally {
        setLoadingLanguages(false);
      }
    };

    fetchLanguages();
  }, []);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };
  const handleLogout = () => {
    navigate("/login");
  };
  const languageCodeMap = {
    English: "us",
    Spanish: "es",
    French: "fr",
    German: "de",
    Hindi:"in",
    Italian:"it",
    Japanese:"jp",
    Mandarin:"tw",
    Sanskrit:"in"
  };

  return (
    <div>
      <Grid celled stackable style={{ minHeight: "100vh" }}>
        <Grid.Row centered>
          {/* Left Sidebar */}
          <Grid.Column width={3} computer={3} tablet={4} mobile={16}>
            <div
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                bottom: "0",
                width: "inherit",
                textAlign: "center",
                padding: "2em 1em",
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Header
                  as="h1"
                  style={{ color: "#58CC02", marginBottom: "1em" }}
                >
                  LEARN APP
                </Header>
                <StepGroup vertical size="big" style={{ marginTop: "5em" }}>
                  <Step active>
                    <Icon name="home" />
                    <StepContent>
                      <Step.Title>Home</Step.Title>
                    </StepContent>
                  </Step>
                  <Step>
                    <Icon name="winner" />
                    <StepContent>
                      <Step.Title>LeaderBoard</Step.Title>
                    </StepContent>
                  </Step>
                </StepGroup>
              </div>
              <Button
                size="big"
                style={{
                  color: "white",
                  fontWeight: "bold",
                  backgroundColor: "#58CC02",
                  border: "2px solid #58CC02",
                }}
                onClick={handleLogout}
              >
                LOGOUT
              </Button>
            </div>
          </Grid.Column>

          {/* Main Content */}
          <Grid.Column
            width={13}
            computer={13}
            tablet={12}
            mobile={16}
            style={{ backgroundColor: "#f7f7f7" }}
          >
          <Menu
  fixed='top'
  style={{
    height: '80px',
    backgroundColor: '#58CC02', // Dark yellow background color
    fontSize: '1.4rem', // Increased font size for the menu
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    padding: '0 1em',
    zIndex: 1000,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Adding shadow for elegance
  }}
>
  {loadingLanguages ? (
    <Loader active inline='centered' size='small' />
  ) : (
    <Dropdown item text={selectedLanguage ? <Flag name={languageCodeMap[selectedLanguage.name]} style={{ marginRight: '5px', fontSize: '1.2rem' }} /> : 'Languages'} style={{ color: 'white', fontSize: '1.4rem' }}>
      <DropdownMenu style={{ fontSize: '1.4rem' }}>
        {languages.map((language) => (
          <DropdownItem key={language._id} onClick={() => handleLanguageChange(language)} style={{ fontSize: '1.4rem' }}>
            <Flag name={languageCodeMap[language.name]} style={{ marginRight: '5px', fontSize: '1.2rem' }} />{language.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )}
  <Menu.Menu position='right' style={{ display: 'flex', alignItems: 'center' }}>
    <Menu.Item style={{ display: 'flex', alignItems: 'center', fontSize: '1.4rem' }}>
      <Icon name='user circle' size='large' style={{ marginRight: '0.5em', color: 'white' }} />
      <span style={{ fontSize: '1.4rem', color: 'white', display: 'flex', alignItems: 'center' }}>{username}</span>
    </Menu.Item>
  </Menu.Menu>
</Menu>


            <div style={{ marginTop: "80px" }}>
              <StudentContent selectedLanguage={selectedLanguage} />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default StudentHome;
