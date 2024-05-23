import React, { useEffect, useState } from 'react';
import { Table, Segment, Header, Message, Dimmer, Loader } from 'semantic-ui-react';

const ViewInstituteAdmin = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await fetch('http://localhost:3000/user/v1/getInstituteAdmins', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust if token is stored differently
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setAdmins(data.adminDetails);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchAdmins();
    }, []);

    return (
        <Segment>
            <Header as='h3' textAlign='center'>View Institute Admins</Header>
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
                <Table celled selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Username</Table.HeaderCell>
                            <Table.HeaderCell>Password</Table.HeaderCell>
                            <Table.HeaderCell>Institute Key</Table.HeaderCell>
                            <Table.HeaderCell>Institute Name</Table.HeaderCell>
                            <Table.HeaderCell>Last Logged In</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {admins.map((admin) => (
                            <Table.Row key={admin.username}>
                                <Table.Cell>{admin.username}</Table.Cell>
                                <Table.Cell>{admin.password}</Table.Cell>
                                <Table.Cell>{admin.instituteKey}</Table.Cell>
                                <Table.Cell>{admin.instituteName}</Table.Cell>
                                <Table.Cell>{new Date(admin.lastLoggedInTime).toLocaleString()}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            )}
        </Segment>
    );
};

export default ViewInstituteAdmin;
