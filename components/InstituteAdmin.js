import React, { useState } from 'react';
import { Container, Grid, Header, Icon, Menu, Segment, Sidebar, Divider, Card, Image } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { useNavigate } from 'react-router-dom'; 
import ViewAllStudents from './ViewAllStudents';
import AddNewStudent from './AddNewStudent';

const InstituteAdmin = () => {
    const navigate = useNavigate();
    const [section, setSection] = useState('viewAll');
    const [selectedStudent, setSelectedStudent] = useState(null);

    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Sidebar
                            as={Menu}
                            animation='overlay'
                            icon='labeled'
                            inverted
                            vertical
                            visible
                            width='thin'
                            style={{ backgroundColor: '#58CC02', color: '#fff', paddingTop: '4em', height: '100vh' }}
                        >
                            <Menu.Item header style={{ textAlign: 'center' }}>
                                <Header as='h3' style={{ color: '#fff' }}>
                                    Lantoon For Institute
                                </Header>
                            </Menu.Item>
                            <Divider />
                            <Menu.Item as='a' onClick={() => setSection('viewAll')} style={{ fontSize: '1.2em', color: '#fff', paddingTop: '1em' }}>
                                <Icon name='list alternate outline' />
                                View All Students
                            </Menu.Item>
                            <Menu.Item as='a' onClick={() => setSection('add')} style={{ fontSize: '1.2em', color: '#fff' }}>
                                <Icon name='user plus' />
                                Add Student
                            </Menu.Item>
                            <Menu.Item as='a' onClick={handleLogout} style={{ fontSize: '1.2em', color: '#fff' }}>
                                <Icon name='sign-out' />
                                Logout
                            </Menu.Item>
                        </Sidebar>
                    </Grid.Column>
                    <Grid.Column width={13} style={{ padding: '2em' }}>
                        <Container>
                            <Grid centered>
                                <Grid.Row centered>
                                    <Grid.Column textAlign='center'>
                                        <Segment basic textAlign='center'>
                                            <Header as='h1' style={{ color: '#333', marginBottom: '1.5em', fontWeight: 'bold' }}>
                                                {section === 'viewAll' ? 'All Students' : 'Add New Student'}
                                            </Header>
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row centered>
                                    <Grid.Column mobile={16} tablet={12} computer={10}>
                                        <Segment vertical style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                                            {section === 'viewAll' && <ViewAllStudents setSelectedStudent={setSelectedStudent} />}
                                            {section === 'add' && <AddNewStudent />}
                                        </Segment>
                                    </Grid.Column>
                                    {selectedStudent && (
                                        <Grid.Column mobile={16} tablet={12} computer={6}>
                                            <Segment vertical style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                                                <StudentDetails student={selectedStudent} />
                                            </Segment>
                                        </Grid.Column>
                                    )}
                                </Grid.Row>
                            </Grid>
                        </Container>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );
};

const StudentDetails = ({ student }) => {
    return (
        <Container>
            <Card centered style={{ boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)', marginBottom: '2em' }}>
                <Image src={student.avatar} wrapped ui={false} />
                <Card.Content>
                    <Card.Header style={{ color: '#333', fontSize: '1.5em', marginBottom: '0.5em' }}>{student.username}</Card.Header>
                    <Card.Meta style={{ color: '#666', marginBottom: '1em' }}>{student.instituteName}</Card.Meta>
                    <Card.Description>
                        <p style={{ color: '#333', marginBottom: '0.5em' }}><strong>Course completed:</strong> {student.chapterCompleted.join(', ')}</p>
                        <p style={{ color: '#333', marginBottom: '0.5em' }}><strong>Last login time:</strong> {student.lastLoggedInTime}</p>
                        <p style={{ color: '#333', marginBottom: '0' }}><strong>Time spent:</strong> {student.timeSpent}</p>
                    </Card.Description>
                </Card.Content>
            </Card>
        </Container>
    );
};

export default InstituteAdmin;
