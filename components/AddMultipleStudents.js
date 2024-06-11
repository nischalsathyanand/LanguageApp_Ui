import React, { useState } from 'react';
import { Button, Form, Segment, Header } from 'semantic-ui-react';

const AddMultipleStudents = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('csvFile', file);

        const token = localStorage.getItem('token');
        console.log(token)// Adjust this according to how you store the token

        try {
            setUploading(true);
            const response = await fetch('http://localhost:3000/user/v1/addStudent/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                setMessage(result.message);
            } else {
                setMessage(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Segment>
            <Header as='h3'>Upload CSV to Add Multiple Students</Header>
            <Form>
                <Form.Field>
                    <input type="file" accept=".csv" onChange={handleFileChange} />
                </Form.Field>
                <Button type="button" onClick={handleUpload} loading={uploading} disabled={uploading}>
                    Upload
                </Button>
                {message && <p>{message}</p>}
            </Form>
        </Segment>
    );
};

export default AddMultipleStudents;
