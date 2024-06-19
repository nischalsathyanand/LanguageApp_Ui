import React, { useState, useEffect } from 'react';
import { Form, Button, Segment, Header, Message, Grid, Icon, Dropdown } from 'semantic-ui-react';

const AddInstituteAdmin = ({ setActiveStep }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        instituteKey: '',
        instituteName: '',
        allowedLanguages: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [availableLanguages, setAvailableLanguages] = useState([]);
    const [loadingLanguages, setLoadingLanguages] = useState(true);

    useEffect(() => {
        // Fetch available languages
        const fetchLanguages = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/v1/languages");
                const data = await response.json();
                setAvailableLanguages(data.map(lang => ({ key: lang._id, text: lang.name, value: lang.name })));
            } catch (error) {
                console.error("Error fetching languages:", error);
                setError('Error fetching languages');
            } finally {
                setLoadingLanguages(false);
            }
        };

        fetchLanguages();
    }, []);

    const handleChange = (e, { name, value }) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleLanguageChange = (e, { value }) => {
        setFormData({ ...formData, allowedLanguages: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const token = localStorage.getItem('token'); // Assuming the token is stored in local storage

        try {
            // First, create the institute
            const response = await fetch('http://localhost:3000/user/v1/create-institute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Add the token to the headers
                },
                body: JSON.stringify({
                    instituteName: formData.instituteName,
                    instituteKey: formData.instituteKey,
                    allowedLanguages: formData.allowedLanguages
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error creating institute');
            }

            // Now, add the admin
            const adminResponse = await fetch('http://localhost:3000/user/v1/addInstituteAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Add the token to the headers
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                    instituteKey: formData.instituteKey
                })
            });

            if (!adminResponse.ok) {
                const adminErrorData = await adminResponse.json();
                throw new Error(adminErrorData.message || 'Error adding institute admin');
            }

            setSuccess(true);
            setFormData({ username: '', password: '', instituteKey: '', instituteName: '', allowedLanguages: [] }); // Reset form
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
                <Form.Field required>
                    <label>Allowed Languages</label>
                    {loadingLanguages ? (
                        <Dropdown
                            placeholder="Loading languages..."
                            fluid
                            multiple
                            selection
                            disabled
                            style={{ borderRadius: '5px' }}
                        />
                    ) : (
                        <Dropdown
                            placeholder="Select Languages"
                            fluid
                            multiple
                            selection
                            options={availableLanguages}
                            value={formData.allowedLanguages}
                            onChange={handleLanguageChange}
                            style={{ borderRadius: '5px' }}
                        />
                    )}
                </Form.Field>
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
