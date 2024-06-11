import React, { useState } from 'react';
import { Container, Header, Icon, Menu, Segment, Table, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { useNavigate } from 'react-router-dom';
import ViewAllStudents from './ViewAllStudents'; // Ensure these components exist
import AddNewStudent from './AddNewStudent'; // Ensure these components exist

const Demo = () => {
    const storedUsername = sessionStorage.getItem('username');
    const navigate = useNavigate();
    const [section, setSection] = useState('viewAll');

    const handleLogout = () => {
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
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F4F5F7', minHeight: '100vh', color: '#000', display: 'flex', flexDirection: 'column' }}>
            {/* Top Navigation Bar */}
            <div style={{ width: '100%', padding: '1em', backgroundColor: '#fff', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Header as='h3' style={{ color: '#000' }}>Lantoon For Institute</Header>
                <div>
                    <Icon name='user outline' size='large' style={{ marginRight: '1em', color: '#000' }} />{storedUsername}
                </div>
            </div>
            {/* Main Content */}
            <div style={{ display: 'flex', flex: 1 }}>
                {/* Sidebar */}
                <div style={{ width: '250px', height: '100vh', position: 'fixed', backgroundColor: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', paddingTop: '2em' }}>
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
                                    <Header as='h3'>James Bowie School</Header>
                                    <Table celled>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>Time</Table.HeaderCell>
                                                <Table.HeaderCell>Day</Table.HeaderCell>
                                                <Table.HeaderCell>Date</Table.HeaderCell>
                                                <Table.HeaderCell>Class Size</Table.HeaderCell>
                                                <Table.HeaderCell>Class Fee</Table.HeaderCell>
                                                <Table.HeaderCell>Coach</Table.HeaderCell>
                                                <Table.HeaderCell>Actions</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell>4:30 to 5:30 PM</Table.Cell>
                                                <Table.Cell>Every Friday</Table.Cell>
                                                <Table.Cell>08.18.2021 to 08.18.2022</Table.Cell>
                                                <Table.Cell>21/40</Table.Cell>
                                                <Table.Cell>$800</Table.Cell>
                                                <Table.Cell>
                                                    <Icon name='user' /> S
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Button icon='edit' />
                                                    <Button icon='trash' />
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>6:00 to 7:00 PM</Table.Cell>
                                                <Table.Cell>Every Monday</Table.Cell>
                                                <Table.Cell>08.18.2021 to 08.18.2022</Table.Cell>
                                                <Table.Cell>33/33</Table.Cell>
                                                <Table.Cell>$820</Table.Cell>
                                                <Table.Cell>
                                                    <Icon name='user' /> <img src="path_to_image" alt="Coach" style={{ width: '20px', borderRadius: '50%' }} />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Button icon='edit' />
                                                    <Button icon='trash' />
                                                </Table.Cell>
                                            </Table.Row>
                                            {/* Add more rows as necessary */}
                                        </Table.Body>
                                    </Table>
                                </>
                            )}
                            {section === 'add' && (
                                <>
                                    <Header as='h3'>Add New Student</Header>
                                    {/* AddNewStudent Component */}
                                </>
                            )}
                        </Segment>
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default Demo;
