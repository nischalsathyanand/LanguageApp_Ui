import React, { useState } from 'react';
import { Container, Menu, Header, Icon } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ManageCourse from './ManageCourse';
import ManageInstitute from './ManageInstitute';

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
  z-index: 1000;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
  margin-top: 70px;

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
  top: 70px;
  bottom: 0;
  z-index: 1000;

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
  margin-top: 70px;

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
    color: #016FA4;
  }
`;

const SuperAdmin = () => {
  const storedUsername = sessionStorage.getItem('username');
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('manage-course');

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const handleSignOut = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <StyledAppContainer>
      <TopNavBar>
        <Header as='h3' style={{ color: '#016FA4' }}>Super Admin Dashboard</Header>
        <div>
          <Icon name='user outline' size='large' style={{ marginRight: '1em', color: '#000' }} />{storedUsername}
        </div>
      </TopNavBar>
      <Layout>
        <Sidebar>
          <Menu secondary vertical style={{ width: '100%' }}>
            <StyledMenuItem
              name='manage-course'
              active={activeItem === 'manage-course'}
              onClick={handleItemClick}
            >
              <Icon name='book' style={{ marginRight: '1em' }} />
              <span>Manage Courses</span>
            </StyledMenuItem>
            <StyledMenuItem
              name='manage-institute'
              active={activeItem === 'manage-institute'}
              onClick={handleItemClick}
            >
              <Icon name='building' style={{ marginRight: '1em' }} />
              <span>Manage Institutes</span>
            </StyledMenuItem>
            <StyledMenuItem
              name='sign-out'
              onClick={handleSignOut}
            >
              <Icon name='sign-out' style={{ marginRight: '1em' }} />
              <span>Sign Out</span>
            </StyledMenuItem>
          </Menu>
        </Sidebar>
        <MainSection>
          <Container fluid>
            {activeItem === 'manage-course' && (
              <>
                <Header as='h3'>Manage Courses</Header>
                <ManageCourse />
              </>
            )}
            {activeItem === 'manage-institute' && (
              <>
                <Header as='h3'>Manage Institutes</Header>
                <ManageInstitute />
              </>
            )}
          </Container>
        </MainSection>
      </Layout>
    </StyledAppContainer>
  );
};

export default SuperAdmin;
