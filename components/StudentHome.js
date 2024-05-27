import React, { useEffect, useState } from 'react';
import {
  Grid,
  GridRow,
  GridColumn,
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
  Container,
} from 'semantic-ui-react';
import { useLocation } from 'react-router-dom';

const StudentHome = () => {
  const location = useLocation();
  const username = location.state?.username || 'Default Username';
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/languages');
        const data = await response.json();
        setLanguages(data);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchLanguages();
  }, []);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <div>
      <Grid celled stackable style={{ minHeight: '100vh' }}>
        <GridRow centered>
          {/* Left Sidebar */}
          <GridColumn width={3} computer={3} tablet={4} mobile={16}>
            <div style={{ textAlign: 'center', padding: '2em 1em' }}>
              <Header as='h1' style={{ color: '#FB9E05', marginBottom: '1em' }}>
                LEARN APP
              </Header>
              <StepGroup vertical size='big' style={{ marginTop: '5em' }}>
                <Step active>
                  <Icon name='home' />
                  <StepContent>
                    <Step.Title>Home</Step.Title>
                  </StepContent>
                </Step>
                <Step>
                  <Icon name='winner' />
                  <StepContent>
                    <Step.Title>LeaderBoard</Step.Title>
                  </StepContent>
                </Step>
              </StepGroup>
              <Button
                size='big'
                style={{
                  marginTop: '2em',
                  color: 'white',
                  fontWeight: 'bold',
                  backgroundColor: '#FB9E05',
                  border: '2px solid #FB9E05',
                }}
              >
                LOGOUT
              </Button>
            </div>
          </GridColumn>

          {/* Main Content */}
          <GridColumn width={13} computer={13} tablet={12} mobile={16} style={{ backgroundColor: '#f7f7f7' }}>
            <Menu
              style={{
                height: '80px',
                backgroundColor: '#FB9E05',
                fontSize: '1.2rem',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                padding: '0 1em',
              }}
            >
              <Dropdown item text={selectedLanguage ? selectedLanguage.name : 'Languages'} size='large' style={{ color: 'white' }}>
                <DropdownMenu style={{ fontSize: '1.2rem' }}>
                  {languages.map((language) => (
                    <DropdownItem key={language._id} onClick={() => handleLanguageChange(language)}>
                      {language.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              {/* Display User Icon and Username */}
              <Menu.Menu position='right' style={{ display: 'flex', alignItems: 'center' }}>
                <Menu.Item style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon name='user circle' size='large' style={{ marginRight: '0.5em', color: 'white' }} />
                  <Header as='h3' inverted style={{ marginBottom: '0', color: 'white' }}>
                    {username}
                  </Header>
                </Menu.Item>
              </Menu.Menu>
            </Menu>
            <Container style={{ marginTop: '2em', padding: '2em' }}>
              {/* Replace with actual content */}
              <p>This is where your content goes.</p>
            </Container>
          </GridColumn>
        </GridRow>
      </Grid>
    </div>
  );
};

export default StudentHome;
