import React, { useState } from 'react';
import { Container, Menu, Segment, Header, Icon } from 'semantic-ui-react';
import ManageCourse from './ManageCourse';
import ManageInstitute from './ManageInstitute';
import { useNavigate } from 'react-router-dom'; 

const SuperAdmin = () => {
    const [activeItem, setActiveItem] = useState('manage-course');
    const navigate = useNavigate();
    const handleItemClick = (e, { name }) => setActiveItem(name);

    const handleSignOut = () => {
        navigate('/login');
    };

    return (
        <Container fluid style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', fontFamily: 'Helvetica Neue' }}>
            <Menu vertical style={{ width: '20%', minHeight: '100vh', borderRight: '1px solid #e5e5e5', paddingTop: '2rem' }}>
                <Header as='h1' style={{ color: '#e50914', marginBottom: '2rem', textAlign: 'center', fontSize: '1.6em' }}>Admin Dashboard</Header>
                <Menu.Item
                    name='manage-course'
                    active={activeItem === 'manage-course'}
                    onClick={handleItemClick}
                    style={{ backgroundColor: activeItem === 'manage-course' ? '#e5e5e5' : '#ffffff', display: 'flex', alignItems: 'center', paddingLeft: '2rem', fontSize: '1.4em', height: '60px' }}
                >
                    <Icon name='book' />
                    <span style={{ marginLeft: '1rem', fontSize: '1em' }}>Manage Course</span>
                </Menu.Item>
                <Menu.Item
                    name='manage-institute'
                    active={activeItem === 'manage-institute'}
                    onClick={handleItemClick}
                    style={{ backgroundColor: activeItem === 'manage-institute' ? '#e5e5e5' : '#ffffff', display: 'flex', alignItems: 'center', paddingLeft: '2rem', fontSize: '1.4em', height: '60px' }}
                >
                    <Icon name='building' />
                    <span style={{ marginLeft: '1rem', fontSize: '1em' }}>Manage Institute</span>
                </Menu.Item>
                <Menu.Item
                    name='sign-out'
                    onClick={handleSignOut}
                    style={{ backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', paddingLeft: '2rem', fontSize: '1.4em', height: '60px' }}
                >
                    <Icon name='sign-out' />
                    <span style={{ marginLeft: '1rem', fontSize: '1em' }}>Sign Out</span>
                </Menu.Item>
            </Menu>
            <Container style={{ width: '80%', padding: '2rem' }}>
                {activeItem === 'manage-course' && (
                    <ManageCourse />
                )}
                {activeItem === 'manage-institute' && (
                    <ManageInstitute />
                )}
            </Container>
        </Container>
    );
};

export default SuperAdmin;
