import React, { useState } from 'react';
import { Button, Form, Segment, Header, Icon } from 'semantic-ui-react';

const AddMultipleStudents = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            setMessage('');
        } else {
            setFile(null);
            setMessage('Please select a valid CSV file.');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a CSV file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('csvFile', file);

        const token = localStorage.getItem('token');

        try {
            setUploading(true);
            
            // Check the current student count and limit before uploading
            const checkResponse = await fetch('http://localhost:3000/user/v1/checkStudentLimit', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const checkResult = await checkResponse.json();
            if (checkResult.exceeded) {
                setMessage('Student limit exceeded. Cannot upload more students.');
                setUploading(false);
                return;
            }

            const response = await fetch('http://localhost:3000/user/v1/addStudent/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
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

    const handleDownloadSample = async () => {
        const token = localStorage.getItem('token');
        const instituteKey = sessionStorage.getItem("institutekey");

        try {
            const response = await fetch(`http://localhost:3000/user/v1/download/sample?instituteKey=${instituteKey}&format=csv`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                const result = await response.json();
                setMessage(`Error: ${result.message}`);
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sample.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error downloading sample CSV:', error);
            setMessage('Error downloading sample CSV');
        }
    };

    return (
        <Segment>
            <Header as='h4'>Upload CSV to Add Multiple Students</Header>
            <Form>
                <Form.Field>
                    <input type="file" accept=".csv" onChange={handleFileChange} />
                </Form.Field>
                <Button type="button" onClick={handleUpload} loading={uploading} disabled={uploading}>
                    Upload
                </Button>
                <Button color="green" onClick={handleDownloadSample}>
                    <Icon name="download" />Download Sample CSV
                </Button>
                {message && <p>{message}</p>}
            </Form>
        </Segment>
    );
};

export default AddMultipleStudents;