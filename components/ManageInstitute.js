// ManageInstitute.js
import React, { useState } from 'react';
import { Segment, Header, Grid, Step, Icon } from 'semantic-ui-react';
import AddInstituteAdmin from './AddInstituteAdmin';
import ViewInstituteAdmin from './ViewInstituteAdmin';

const ManageInstitute = () => {
    const [activeStep, setActiveStep] = useState('viewInstituteAdmin');

    const handleViewInstituteAdmin = () => {
        setActiveStep('viewInstituteAdmin');
    };

    const handleAddInstituteAdmin = () => {
        setActiveStep('addInstituteAdmin');
    };

    const renderActiveStep = () => {
        switch (activeStep) {
            case 'viewInstituteAdmin':
                return <ViewInstituteAdmin />;
            case 'addInstituteAdmin':
                return <AddInstituteAdmin setActiveStep={setActiveStep} />;
            default:
                return null;
        }
    };

    return (
        <Segment style={{ margin: '20px auto', width: '80%', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
            <Grid textAlign="center" verticalAlign="middle" style={{ padding: '20px' }}>
                <Grid.Column style={{ maxWidth: '800px' }}>
                    <Header as='h2' textAlign='left' style={{ marginBottom: '20px', color: '#0056b3' }}>
                        <Icon name="building" color="blue" size="large" />
                        <Header.Content>
                            Manage Institute
                            <Header.Subheader>Select an action to manage institute admins</Header.Subheader>
                        </Header.Content>
                    </Header>
                    <Step.Group fluid>
                        <Step active={activeStep === 'viewInstituteAdmin'} link onClick={handleViewInstituteAdmin}>
                            <Icon name="list" />
                            <Step.Content>
                                <Step.Title>View Institute Admin</Step.Title>
                            </Step.Content>
                        </Step>
                        <Step active={activeStep === 'addInstituteAdmin'} link onClick={handleAddInstituteAdmin}>
                            <Icon name="user plus" />
                            <Step.Content>
                                <Step.Title>Add Institute Admin</Step.Title>
                            </Step.Content>
                        </Step>
                    </Step.Group>

                    {renderActiveStep()} {/* Render the active step based on state */}
                </Grid.Column>
            </Grid>
        </Segment>
    );
};

export default ManageInstitute;
