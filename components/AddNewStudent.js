import React, { useState } from 'react';
import { Container, Header, Segment, Icon, Button, Form, Message } from 'semantic-ui-react';

const AddNewStudent = () => {
    const [formData, setFormData] = useState({
        username: '',
        class: '',
        password: '',
        image: '',
        address: '',
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

        const token = localStorage.getItem('token'); // Assuming the token is stored in local storage

        try {
            const response = await fetch('http://localhost:3000/user/v1/addStudent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add the token to the headers
                },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to add student');
            }

            setSuccessMessage('Student added successfully');
            setFormData({
                username: '',
                class: '',
                password: '',
                image: '',
                address: '',
            });
        } catch (error) {
            console.error('Error adding student:', error);
            setError(error.message || 'Failed to add student. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container textAlign='center' style={{ color: '#333' }}>
            <Header as='h2'>Add Student Section</Header>
            <Segment placeholder>
                <Header icon>
                    <Icon name='user plus' />
                    Add a new student to the class
                </Header>
                <Form onSubmit={handleSubmit} error={error !== null} success={successMessage !== null} loading={loading}>
                    <Form.Input
                        label='Name'
                        placeholder='Name'
                        name='username'
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <Form.Input
                        label='Class'
                        placeholder='Class'
                        name='class'
                        value={formData.class}
                        onChange={handleChange}
                        required
                    />
                    <Form.Input
                        type='password'
                        label='Password'
                        placeholder='Password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Form.Input
                        label='Image URL'
                        placeholder='Image URL'
                        name='image'
                        value={formData.image}
                        onChange={handleChange}
                    />
                    <Form.TextArea
                        label='Address'
                        placeholder='Address'
                        name='address'
                        value={formData.address}
                        onChange={handleChange}
                    />
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
                    <Button primary type='submit'>Add Student</Button>
                </Form>
            </Segment>
        </Container>
    );
};

export default AddNewStudent;
