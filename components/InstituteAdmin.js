import React, { useState } from 'react';
import { Sidebar, Segment, Menu, Icon, Table, Container, Header, Grid, Button, Form } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const students = [
    { name: 'Bea', xp: 1039, time: '23h 12m', lessons: '2/4 lessons' },
    { name: 'Eddy', xp: 2983, time: '23h 12m', lessons: '3/4 lessons' },
    { name: 'Junior', xp: 2348, time: '23h 12m', lessons: '0/4 lessons' },
    { name: 'Lily', xp: 1482, time: '23h 12m', lessons: '4/4 lessons' },
    { name: 'Lin', xp: 1231, time: '23h 12m', lessons: '2/4 lessons' },
    { name: 'Lucy', xp: 957, time: '23h 12m', lessons: '0/4 lessons' },
    { name: 'Vikra', xp: 923, time: '23h 12m', lessons: '1/4 lessons' },
    { name: 'Zari', xp: 912, time: '23h 12m', lessons: '4/4 lessons' }
];

const InstituteAdmin = () => {
    const [view, setView] = useState('dashboard');
    const [formState, setFormState] = useState({
        name: '',
        class: '',
        details: '',
        username: '',
        password: ''
    });

    const handleInputChange = (e, { name, value }) => {
        setFormState({ ...formState, [name]: value });
    };

    const handleAddStudent = () => {
        // Add logic to add the student to the list
        console.log('Student added', formState);
        setFormState({
            name: '',
            class: '',
            details: '',
            username: '',
            password: ''
        });
    };

    return (
        <Sidebar.Pushable as={Segment} style={{ minHeight: '100vh' }}>
            <Sidebar
                as={Menu}
                animation='push'
                icon='labeled'
                vertical
                visible
                width='thin'
                style={{ backgroundColor: '#f7f7f7', padding: '1em' }}
            >
                <Menu.Item style={{ marginBottom: '1em', textAlign: 'center' }}>
                    <Icon name='user circle' size='big' />
                    <div>Mr. Oscar</div>
                </Menu.Item>
                <Menu.Item style={{ padding: '1em 0' }}>
                    <Button primary style={{ width: '100%' }} onClick={() => setView('addStudent')}>Add Student</Button>
                </Menu.Item>
                <Menu.Item style={{ padding: '1em 0' }}>
                    <Button secondary style={{ width: '100%' }} onClick={() => setView('dashboard')}>View Student Dashboard</Button>
                </Menu.Item>
                <Menu.Item style={{ padding: '1em 0' }}>
                    <Button style={{ width: '100%' }}>Logout</Button>
                </Menu.Item>
            </Sidebar>

            <Sidebar.Pusher>
                <Segment basic>
                    <Container>
                        <Header as='h2' style={{ marginTop: '1em' }}>French 2 Period 4</Header>
                        <Menu tabular>
                            <Menu.Item name='students' active={view === 'dashboard'} onClick={() => setView('dashboard')} />
                            <Menu.Item name='assignments' />
                            <Menu.Item name='curriculum' />
                            <Menu.Item name='settings' />
                        </Menu>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={10}>
                                    {view === 'dashboard' && (
                                        <Table celled style={{ marginTop: '1em' }}>
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                                    <Table.HeaderCell>XP This Week</Table.HeaderCell>
                                                    <Table.HeaderCell>Time This Week</Table.HeaderCell>
                                                    <Table.HeaderCell>Latest Assignment</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {students.map(student => (
                                                    <Table.Row key={student.name}>
                                                        <Table.Cell>{student.name}</Table.Cell>
                                                        <Table.Cell>{student.xp}</Table.Cell>
                                                        <Table.Cell>{student.time}</Table.Cell>
                                                        <Table.Cell>{student.lessons}</Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                        </Table>
                                    )}
                                    {view === 'addStudent' && (
                                        <Form style={{ marginTop: '1em' }}>
                                            <Form.Input
                                                label='Name'
                                                name='name'
                                                value={formState.name}
                                                onChange={handleInputChange}
                                            />
                                            <Form.Input
                                                label='Class'
                                                name='class'
                                                value={formState.class}
                                                onChange={handleInputChange}
                                            />
                                            <Form.Input
                                                label='Details'
                                                name='details'
                                                value={formState.details}
                                                onChange={handleInputChange}
                                            />
                                            <Form.Input
                                                label='Username'
                                                name='username'
                                                value={formState.username}
                                                onChange={handleInputChange}
                                            />
                                            <Form.Input
                                                label='Password'
                                                name='password'
                                                value={formState.password}
                                                onChange={handleInputChange}
                                                type='password'
                                            />
                                            <Button primary onClick={handleAddStudent}>Submit</Button>
                                        </Form>
                                    )}
                                </Grid.Column>
                                
                            </Grid.Row>
                        </Grid>
                    </Container>
                </Segment>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    );
}

export default InstituteAdmin;
