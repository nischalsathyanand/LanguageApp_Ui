import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Header,
  Icon,
  Menu,
  Loader,
  Flag,
} from "semantic-ui-react";
import { NavLink, useNavigate } from "react-router-dom";
import StudentContent from "./StudentContent";
import StudentLanguageSelecter from "./StudentLanguageSelecter";

const StudentHome = () => {
  const [username, setUsername] = useState("Default Username");
  const [name, setName] = useState("Default Username");
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [loadingLanguages, setLoadingLanguages] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the username from session storage
    const storedUsername = sessionStorage.getItem('username');
    const studentName = sessionStorage.getItem('name')

    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (studentName) {
      setName(studentName)
    }

    // Fetch languages
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
    // Clear session storage
    sessionStorage.clear();
    navigate("/login");
  };

  const languageCodeMap = {
    English: "us",
    Spanish: "es",
    French: "fr",
    German: "de",
    Hindi: "in",
    Italian: "it",
    Japanese: "jp",
    Mandarin: "cn",
    Sanskrit: "in",
    Malayalam: "in",
    Tamil: "in",
  };

  return (
    <Grid celled stackable style={{ minHeight: "100vh", margin: '0px', padding: '0px', position: 'relative', borderRadius: '0px' }}>
      <Grid.Row centered style={{ borderRadius: '0px' }}>
        {/* Left Sidebar */}
        {/* Left Sidebar */}
        <Grid.Column width={3} computer={3} tablet={4} mobile={16} style={{
          position: "relative",
          top: "0",
          left: "0",
          bottom: "0",
          maxWidth: "20%",
          textAlign: "center",
          padding: "2em 1em",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          // justifyContent: "space-between",
        }}>
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              bottom: "0",
              width: "20%",
              textAlign: "center",
              padding: "2em 1em",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              // justifyContent: "space-between",
            }}
          >
            <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Header
                as="h1"
                style={{ color: "#58CC02", marginBottom: "2em", marginTop: '1em' }}
              >
                Lantoon
              </Header>
              {/* <StepGroup vertical size="big" style={{ marginTop: "5em" }}>
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
                </StepGroup> */}
              <NavLink
                to="/learn"
                style={{
                  color: "blue",
                  position: 'relative',
                  minHeight: '60px',
                  minWidth: '190px',
                  fontWeight: "bold",
                  backgroundColor: "lightSkyBlue",
                  border: "1px solid blue",
                  paddingLeft: '10px',
                  borderRadius: '15px',
                  marginBottom: '10px',
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  textDecoration: "none",
                  display: 'flex',
                }}
              >
                <img src="https://cdn-icons-png.flaticon.com/128/10473/10473299.png" style={{ position: 'relative', maxHeight: '90%', maxWidth: '20%', marginRight: '10px' }} />
                LEARN
              </NavLink>
              <NavLink
                to="/leaderboards"
                style={({ isActive }) => ({
                  color: isActive ? "blue" : "gray",
                  position: 'relative',
                  minHeight: '60px',
                  minWidth: '190px',
                  fontWeight: "bold",
                  backgroundColor: isActive ? "lightSkyBlue" : "white",
                  border: isActive ? "1px solid blue" : "none",
                  paddingLeft: '10px',
                  borderRadius: '15px',
                  marginBottom: '10px',
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  textDecoration: "none"
                })}
              >

                <img src="https://cdn-icons-png.flaticon.com/128/5355/5355647.png" style={{ position: 'relative', maxHeight: '90%', maxWidth: '20%', marginRight: '10px' }} />
                LEADERBOARDS
              </NavLink>

              <button
                style={{
                  color: "white",
                  fontWeight: "bold",
                  marginTop: '30px',
                  backgroundColor: "lightcoral", // light red background
                  width: '150px',
                  height: '70px',
                  border: "2px solid lightcoral", // red border
                  borderRadius: '25px',
                  boxShadow: "0px 4px 8px rgba(255, 0, 0, 0.5)", // shadow with red color
                  cursor: 'pointer',
                  transition: 'background-color 0.3s, transform 0.3s' // smooth transition for hover effects
                }}
                onClick={handleLogout}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "red"} // change to red on hover
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "lightcoral"} // revert back to light red
              >
                LOGOUT
              </button>
            </div>

          </div>
        </Grid.Column>
        {/* Main Content */}
        <Grid.Column
          width={13}
          computer={13}
          tablet={12}
          mobile={16}
          style={{ backgroundColor: "#f7f7f7", position: 'relative', padding: '0px', margin: '0px' }}
        >
          <Menu
            fixed="top"
            style={{
              height: "50px",
              backgroundColor: "#58CC02",
              fontSize: "1.4rem",
              color: "white",
              display: "flex",
              alignItems: "center",
              zIndex: 1000,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              position: 'sticky',
              top: '0px'
            }}
          >
            {loadingLanguages ? (
              <Loader active inline="centered" size="small" />
            ) : (
              <div
                onClick={() => setSelectedLanguage(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                {selectedLanguage && (
                  <>
                    <Flag
                      name={languageCodeMap[selectedLanguage.name]}
                      style={{ marginRight: "10px", fontSize: "2rem" }}
                    />
                    {/* <span style={{ fontSize: "1.4rem" }}>
                      {selectedLanguage.name}
                    </span> */}
                  </>
                )}
              </div>
            )}
            <Menu.Menu
              position="right"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Menu.Item
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1.4rem",
                }}
              >
                <Icon
                  name="user circle"
                  size="large"
                  style={{ marginRight: "0.5em", color: "white" }}
                />
                <span
                  style={{
                    fontSize: "1.4rem",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {name}
                </span>
              </Menu.Item>
            </Menu.Menu>
          </Menu>

          <div style={{ marginTop: "50px" }}>
            {selectedLanguage ? (
              <StudentContent selectedLanguage={selectedLanguage} username={username} />
            ) : (
              <StudentLanguageSelecter
                languages={languages}
                languageCodeMap={languageCodeMap}
                handleLanguageChange={handleLanguageChange}
              />
            )}
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default StudentHome;
