import React, { useState } from 'react';
import { Container, Header, Icon, Menu } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ViewAllStudents from './ViewAllStudents';
import AddNewStudent from './AddNewStudent';
import AddMultipleStudents from './AddMultipleStudents'; // Import the new component

const StyledAppContainer = styled.div`
  font-family: Arial, sans-serif;
  background-color: #f5f9fc;
  min-height: 100vh;
  color: #000;
  display: flex;
  flex-direction: column;
`;

const TopNavBar = styled.div`
  width: 100%;
  padding: 1em;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000; /* Ensure it's above other content */
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
  margin-top: 70px; /* Adjust this value to match the height of the navbar */

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
  }
`;

const Sidebar = styled.div`
  grid-column: 1;
  grid-row: 1 / span 2;
  background-color: #fff;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  padding-top: 2em;
  color: #016FA4;
  position: fixed;
  left: 0;
  top: 70px; /* Adjust this value to match the height of the navbar */
  bottom: 0;
  z-index: 1000; /* Ensure it's above other content */

  @media (max-width: 768px) {
    grid-column: 1 / span 2;
    grid-row: 2;
    flex-direction: row;
    overflow-x: auto;
  }
`;

const MainSection = styled.div`
  grid-column: 2;
  grid-row: 1 / span 2;
  padding: 2em;
  overflow-y: auto;
  background-color: #f5f9fc;
  margin-top: 70px; /* Adjust this value to match the height of the navbar */

  @media (max-width: 768px) {
    grid-column: 1 / span 2;
    grid-row: 3;
    padding: 1em;
  }
`;

const StyledMenuItem = styled(Menu.Item)`
  font-size: 1.2em;
  padding: 1em 1.5em;
  display: flex;
  align-items: center;
  text-align: left;
  margin-bottom: 1em;
  color: ${(props) => (props.active ? 'white' : '#016FA4')};
  background-color: ${(props) => (props.active ? '#E50914' : 'transparent')} !important;
  border-radius: 4px;
  &:hover {
    background-color: #E50914;
    color:#016FA4 ;
  }
`;

const InstituteAdmin = () => {
  const storedUsername = sessionStorage.getItem('username');
  const navigate = useNavigate();
  const [section, setSection] = useState('viewAll');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <StyledAppContainer>
      {/* Top Navigation Bar */}
      <TopNavBar>
        <Header as='h3' style={{ color: '#016FA4' }}>Lantoon For Institute</Header>
        <div>
          <Icon name='user outline' size='large' style={{ marginRight: '1em', color: '#000' }} />{storedUsername}
        </div>
      </TopNavBar>
      {/* Main Content */}
      <Layout>
        {/* Sidebar */}
        <Sidebar>
          <Menu secondary vertical style={{ width: '100%' }}>
            <StyledMenuItem
              as='a'
              onClick={() => setSection('viewAll')}
              active={section === 'viewAll'}
            >
              <Icon name='list alternate outline' style={{ marginRight: '1em' }} />
              <span>View All Students</span>
            </StyledMenuItem>
            <StyledMenuItem
              as='a'
              onClick={() => setSection('add')}
              active={section === 'add'}
            >
              <Icon name='user plus' style={{ marginRight: '1em' }} />
              <span>Add Student</span>
            </StyledMenuItem>
            <StyledMenuItem
              as='a'
              onClick={() => setSection('addMultiple')}
              active={section === 'addMultiple'}
            >
              <Icon name='users' style={{ marginRight: '1em' }} />
              <span>Add Multiple Students</span>
            </StyledMenuItem>
            <StyledMenuItem
              as='a'
              onClick={handleLogout}
            >
              <Icon name='sign-out' style={{ marginRight: '1em' }} />
              <span>Logout</span>
            </StyledMenuItem>
          </Menu>
        </Sidebar>
        {/* Main Section */}
        <MainSection>
          <Container fluid>
            {section === 'viewAll' && (  <>
               
                <ViewAllStudents setSelectedStudent={setSelectedStudent} />
                </>)
            }
           
              
             {section === 'add' && (
              <>
                <Header as='h3'>Add New Student</Header>
                <AddNewStudent />
              </>
            )}
            {section === 'addMultiple' && (
              <>
                <Header as='h3'>Add Multiple Students</Header>
                <AddMultipleStudents />
              </>
            )}
          </Container>
        </MainSection>
      </Layout>
    </StyledAppContainer>
  );
};

export default InstituteAdmin;
