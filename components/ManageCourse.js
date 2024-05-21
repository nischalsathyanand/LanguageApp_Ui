import React, { useState } from 'react';
import { Segment, Header, Grid, Step, Icon } from 'semantic-ui-react';
import ViewCourses from './viewCourses'; // Corrected import naming conventions
import AddCourse from './addNewCourse'; // Corrected import naming conventions
import EditCourse from './editCourse'; // Assuming you have an EditCourse component

const ManageCourse = () => {
    const [activeStep, setActiveStep] = useState('viewAllCourses');

    const handleViewAllCourses = () => {
        setActiveStep('viewAllCourses');
    };

    const handleEditCourse = () => {
        setActiveStep('editCourse');
    };

    const handleAddNewCourse = () => {
        setActiveStep('addNewCourse');
    };

    // Handle unexpected activeStep values
    const renderActiveStep = () => {
        switch (activeStep) {
            case 'viewAllCourses':
                return <ViewCourses />;
            case 'editCourse':
                return <EditCourse />;
            case 'addNewCourse':
                return <AddCourse setActiveStep={setActiveStep} />;
            default:
                return null;
        }
    };

    return (
        <Segment style={{ margin: '20px auto', width: '80%', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
            <Grid textAlign="center" verticalAlign="middle" style={{ padding: '20px' }}>
                <Grid.Column style={{ maxWidth: '800px' }}>
                    <Header as='h2' textAlign='left' style={{ marginBottom: '20px', color: '#0056b3' }}>
                        <Icon name="book" color="blue" size="large" />
                        <Header.Content>
                            Manage Courses
                            <Header.Subheader>Select an action to manage courses</Header.Subheader>
                        </Header.Content>
                    </Header>
                    <Step.Group fluid>
                        <Step active={activeStep === 'viewAllCourses'} link onClick={handleViewAllCourses}>
                            <Icon name="list alternate" />
                            <Step.Content>
                                <Step.Title>View All Courses</Step.Title>
                            </Step.Content>
                        </Step>
                        <Step active={activeStep === 'editCourse'} link onClick={handleEditCourse}>
                            <Icon name="edit" />
                            <Step.Content>
                                <Step.Title>Edit Course</Step.Title>
                            </Step.Content>
                        </Step>
                        <Step active={activeStep === 'addNewCourse'} link onClick={handleAddNewCourse}>
                            <Icon name="plus" />
                            <Step.Content>
                                <Step.Title>Add New Course</Step.Title>
                            </Step.Content>
                        </Step>
                    </Step.Group>

                    {renderActiveStep()} {/* Render the active step based on state */}
                </Grid.Column>
            </Grid>
        </Segment>
    );
};

export default ManageCourse;
