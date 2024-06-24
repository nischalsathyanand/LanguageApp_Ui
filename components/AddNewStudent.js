import React, { useState } from 'react';
import { Container, Segment, Button, Form, Message, Grid } from 'semantic-ui-react';
import validator from 'validator';

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
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e, { name, value }) => {
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const errors = {};
        if (validator.isEmpty(formData.StudentName)) {
            errors.StudentName = 'StudentName is required';
        }
        if (!validator.isEmail(formData.Email)) {
            errors.Email = 'Valid Email is required';
        }
        if (!validator.isMobilePhone(formData.Phone)) {
            errors.Phone = 'Valid Phone number is required';
        }
        if (validator.isEmpty(formData.Class)) {
            errors.Class = 'Class is required';
        }
        if (validator.isEmpty(formData.Section)) {
            errors.Section = 'Section is required';
        }
        if (!validator.isDate(formData.DOB)) {
            errors.DOB = 'Valid DOB is required';
        }
        if (validator.isEmpty(formData.Roll_No)) {
            errors.Roll_No = 'Roll_No is required';
        }
       
        return errors;
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setLoading(false);
            return;
        }

        setFormErrors({});
        const token = localStorage.getItem('token');

        try {
            // Check the current student count and limit before submitting the form
            const checkResponse = await fetch('http://localhost:3000/user/v1/checkStudentLimit', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const checkResult = await checkResponse.json();
            if (checkResult.exceeded) {
                setError('Student limit exceeded. Cannot add more students.');
                setLoading(false);
                return;
            }

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
                Roll_No: ''
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
                                    error={formErrors.StudentName ? { content: formErrors.StudentName } : null}
                                    required
                                />
                                <Form.Input
                                    label="Email"
                                    placeholder='Email'
                                    name='Email'
                                    value={formData.Email}
                                    onChange={handleChange}
                                    error={formErrors.Email ? { content: formErrors.Email } : null}
                                    required
                                />
                                <Form.Input
                                    label="Phone"
                                    placeholder='Phone'
                                    name='Phone'
                                    value={formData.Phone}
                                    onChange={handleChange}
                                    error={formErrors.Phone ? { content: formErrors.Phone } : null}
                                    required
                                />
                                <Form.Input
                                    label="Class"
                                    placeholder='Class'
                                    name='Class'
                                    value={formData.Class}
                                    onChange={handleChange}
                                    error={formErrors.Class ? { content: formErrors.Class } : null}
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
                                    error={formErrors.Section ? { content: formErrors.Section } : null}
                                    required
                                />
                                <Form.Input
                                    type='date'
                                    label='Date of Birth'
                                    name='DOB'
                                    value={formData.DOB}
                                    onChange={handleChange}
                                    error={formErrors.DOB ? { content: formErrors.DOB } : null}
                                    required
                                />
                                <Form.Input
                                    label='Roll No'
                                    placeholder='Roll No'
                                    name='Roll_No'
                                    value={formData.Roll_No}
                                    onChange={handleChange}
                                    error={formErrors.Roll_No ? { content: formErrors.Roll_No } : null}
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