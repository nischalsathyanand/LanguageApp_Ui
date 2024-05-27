import React, { useState, useEffect } from 'react';
import { Container, Table, Header, Message, Dimmer, Loader } from 'semantic-ui-react';

const ViewAllStudents = ({ setSelectedStudent }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token'); // Assuming the token is stored in local storage
                const instituteKey = 'tkm_key'; // Replace with your actual institute key or pass it from props
                const response = await fetch(`http://localhost:3000/user/v1/getstudentdetails?instituteKey=${instituteKey}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch student details');
                }

                const data = await response.json();
                if (!data.studentDetails || !Array.isArray(data.studentDetails)) {
                    throw new Error('No student details found');
                }

                setStudents(data.studentDetails);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching student details:', error);
                setError('Failed to fetch student details. Please try again.');
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    return (
        <Container>
            <Header as='h2' textAlign='center'></Header>
            {loading && (
                <Dimmer active inverted>
                    <Loader size='large'>Loading...</Loader>
                </Dimmer>
            )}
            {error && (
                <Message negative>
                    <Message.Header>Error:</Message.Header>
                    <p>{error}</p>
                </Message>
            )}
            {!loading && !error && (
                <Table celled striped selectable textAlign='center'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Student Name</Table.HeaderCell>
                            <Table.HeaderCell>Institute Name</Table.HeaderCell>
                            <Table.HeaderCell>Chapters Completed</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {students.map((student, index) => (
                            <Table.Row key={index} onClick={() => setSelectedStudent(student)} style={{ cursor: 'pointer' }}>
                                <Table.Cell>{student.username}</Table.Cell>
                                <Table.Cell>{student.instituteName}</Table.Cell>
                                <Table.Cell>{student.chapterCompleted.join(', ')}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            )}
        </Container>
    );
};

export default ViewAllStudents;
