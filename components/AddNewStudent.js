import React, { useState } from 'react';
import { Container, Segment, Button, Form, Message, Grid } from 'semantic-ui-react';

const AddNewStudent = () => {
    const [formData, setFormData] = useState({
        StudentName: '',
        Email: '',
        Phone: '',
        Class: '',
        Section: '',
        DOB: '',
        Roll_No: '',
        Language: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e, { name, value }) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/user/v1/addsinglestudent', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to add student');
            }

            setSuccessMessage('Student added successfully');
            setFormData({
                StudentName: '',
                Email: '',
                Phone: '',
                Class: '',
                Section: '',
                DOB: '',
                Roll_No: '',
                Language: '',
            });
        } catch (error) {
            console.error('Error adding student:', error);
            setError(error.message || 'Failed to add student. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid textAlign='center' style={{ backgroundColor: '#E6EFF4', color: '#1c1c1c', width: '100vw', maxWidth: '100%', padding: '2em' }}>
            <Segment style={{ backgroundColor: '#E7EEF4', color: '#5B9DBF', padding: '3em', borderRadius: '15px' }}>
                <Form onSubmit={handleSubmit} error={error !== null} success={successMessage !== null} loading={loading}>
                    <Grid columns={2} stackable>
                        <Grid.Row>
                            <Grid.Column>
                                <Form.Input
                                    label="Student Name"
                                    placeholder='Student Name'
                                    name='StudentName'
                                    value={formData.StudentName}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Input
                                    label="Email"
                                    placeholder='Email'
                                    name='Email'
                                    value={formData.Email}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Input
                                    label="Phone"
                                    placeholder='Phone'
                                    name='Phone'
                                    value={formData.Phone}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Input
                                    label="Class"
                                    placeholder='Class'
                                    name='Class'
                                    value={formData.Class}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Input
                                    label="Section"
                                    placeholder='Section'
                                    name='Section'
                                    value={formData.Section}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Input
                                    type='date'
                                    label='Date of Birth'
                                    name='DOB'
                                    value={formData.DOB}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Input
                                    label='Roll No'
                                    placeholder='Roll No'
                                    name='Roll_No'
                                    value={formData.Roll_No}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Input
                                    label='Language'
                                    placeholder='Language'
                                    name='Language'
                                    value={formData.Language}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Message
                        success
                        header='Success'
                        content={successMessage}
                    />
                    <Message
                        error
                        header='Error'
                        content={error}
                    />
                    <Button primary type='submit' style={{ backgroundColor: '#E50914', color: '#fff', marginTop: '1em', borderRadius: '15px' }}>Add Student</Button>
                </Form>
            </Segment>
        </Container>
    );
};

export default AddNewStudent;
