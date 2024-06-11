import React, { useState } from 'react';
import { Container, Header, Icon, Menu, Segment } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { useNavigate } from 'react-router-dom';
import ViewAllStudents from './ViewAllStudents';
import AddNewStudent from './AddNewStudent';
import AddMultipleStudents from './AddMultipleStudents'; // Import the new component

const InstituteAdmin = () => {
    const storedUsername = sessionStorage.getItem('username');
    const navigate = useNavigate();
    const [section, setSection] = useState('viewAll');
    const [selectedStudent, setSelectedStudent] = useState(null);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    const menuItemStyle = {
        fontSize: '1.2em',
        padding: '1em 0',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'left',
        marginBottom: '1em',
    };

    const selectedMenuItemStyle = {
        ...menuItemStyle,
        backgroundColor: '#E50914',
        color: 'white'
    };

    const unselectedMenuItemStyle = {
        ...menuItemStyle,
        color: '#000'
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#E6EFF4', minHeight: '100vh', color: '#000', display: 'flex', flexDirection: 'column' }}>
            {/* Top Navigation Bar */}
            <div style={{ width: '100%', padding: '1em', backgroundColor: '#E6EFF4', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Header as='h3' style={{ color: '#016FA4' }}>Lantoon For Institute</Header>
                <div>
                    <Icon name='user outline' size='large' style={{ marginRight: '1em', color: '#000' }} />{storedUsername}
                </div>
            </div>
            {/* Main Content */}
            <div style={{ display: 'flex', flex: 1 }}>
                {/* Sidebar */}
                <div style={{ width: '250px', height: '100vh', position: 'fixed', backgroundColor: '#E6EFF4', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', paddingTop: '2em',color:"#016FA4" }}>
                    <Menu secondary vertical style={{ width: '100%' }}>
                        <Menu.Item
                            as='a'
                            onClick={() => setSection('viewAll')}
                            style={section === 'viewAll' ? selectedMenuItemStyle : unselectedMenuItemStyle}
                        >
                            <Icon name='list alternate outline' style={{ marginRight: '1em' }} />
                            <span>View All Students</span>
                        </Menu.Item>
                        <Menu.Item
                            as='a'
                            onClick={() => setSection('add')}
                            style={section === 'add' ? selectedMenuItemStyle : unselectedMenuItemStyle}
                        >
                            <Icon name='user plus' style={{ marginRight: '1em' }} />
                            <span>Add Student</span>
                        </Menu.Item>
                        <Menu.Item
                            as='a'
                            onClick={() => setSection('addMultiple')}
                            style={section === 'addMultiple' ? selectedMenuItemStyle : unselectedMenuItemStyle}
                        >
                            <Icon name='users' style={{ marginRight: '1em' }} />
                            <span>Add Multiple Students</span>
                        </Menu.Item>
                        <Menu.Item
                            as='a'
                            onClick={handleLogout}
                            style={unselectedMenuItemStyle}
                        >
                            <Icon name='sign-out' style={{ marginRight: '1em' }} />
                            <span>Logout</span>
                        </Menu.Item>
                    </Menu>
                </div>
                {/* Main Section */}
                <div style={{ marginLeft: '250px', flex: 1, padding: '2em', overflowY: 'auto' }}>
                    <Container fluid>
                        <Segment vertical style={{ borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', padding: '2em' }}>
                            {section === 'viewAll' && (
                                <>
                                    <Header as='h3'>Student Dashboard</Header>
                                    <ViewAllStudents setSelectedStudent={setSelectedStudent} />
                                </>
                            )}
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
                        </Segment>
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default InstituteAdmin;
