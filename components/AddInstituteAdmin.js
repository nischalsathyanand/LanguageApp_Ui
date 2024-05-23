import React, { useState } from 'react';
import { Form, Button, Segment, Header, Message, Grid, Icon } from 'semantic-ui-react';

const AddInstituteAdmin = ({ setActiveStep }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        instituteKey: '',
        instituteName: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e, { name, value }) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const token = localStorage.getItem('token'); // Assuming the token is stored in local storage

        try {
            const response = await fetch('http://localhost:3000/user/v1/addInstituteAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Add the token to the headers
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error adding institute admin');
            }

            setSuccess(true);
            setFormData({ username: '', password: '', instituteKey: '', instituteName: '' });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Segment raised style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: '#f9f9f9', padding: '20px' }}>
            <Header as="h2" icon textAlign="center" style={{ color: '#0088cc' }}>
                <Icon name="user plus" />
                Add Institute Admin
            </Header>
            <Form onSubmit={handleSubmit} loading={loading} success={success} error={!!error}>
                <Form.Input
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '5px' }}
                />
                <Form.Input
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '5px' }}
                />
                <Form.Input
                    label="Institute Key"
                    name="instituteKey"
                    value={formData.instituteKey}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '5px' }}
                />
                <Form.Input
                    label="Institute Name"
                    name="instituteName"
                    value={formData.instituteName}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '5px' }}
                />
                <Message
                    success
                    header="Success"
                    content="Institute admin added successfully!"
                />
                <Message
                    error
                    header="Error"
                    content={error}
                />
                <Grid>
                    <Grid.Column textAlign="center">
                        <Button type="submit" color="blue" style={{ marginTop: '1em', borderRadius: '20px', padding: '12px 24px', backgroundColor: '#0088cc', color: '#fff', fontWeight: 'bold' }}>
                            Add Admin
                        </Button>
                    </Grid.Column>
                </Grid>
            </Form>
        </Segment>
    );
};

export default AddInstituteAdmin;
