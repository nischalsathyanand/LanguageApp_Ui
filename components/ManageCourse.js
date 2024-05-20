import React, { useState } from 'react';
import { Segment, Header, Grid, Step } from 'semantic-ui-react';
import ViewCourses from './viewCourses';
import AddCourse from './addCourse';

const ManageCourse = () => {
    const [activeStep, setActiveStep] = useState('viewAllCourses');

    const handleViewAllCourses = () => {
        setActiveStep('viewAllCourses');
    };

    const handleAddNewCourse = () => {
        setActiveStep('addNewCourse');
    };

    return (
        <Segment style={{ margin: '20px auto', width: '100%' }}>
            <Grid textAlign="center" verticalAlign="middle" style={{ padding: '20px' }}>
                <Grid.Column style={{ maxWidth: '800px' }}>
                    <Header as='h2' textAlign='left' style={{ marginBottom: '20px', color: '#2185d0' }}>
                        Manage Courses
                    </Header>
                    <Step.Group fluid>
                        <Step active={activeStep === 'viewAllCourses'} link onClick={handleViewAllCourses}>
                            <Step.Content>
                                <Step.Title>View All Courses</Step.Title>
                            </Step.Content>
                        </Step>
                        <Step active={activeStep === 'addNewCourse'} link onClick={handleAddNewCourse}>
                            <Step.Content>
                                <Step.Title>Add New Course</Step.Title>
                            </Step.Content>
                        </Step>
                    </Step.Group>

                    {activeStep === 'viewAllCourses' && <ViewCourses />}
                    {activeStep === 'addNewCourse' && <AddCourse setActiveStep={setActiveStep} />}
                </Grid.Column>
            </Grid>
        </Segment>
    );
};

export default ManageCourse;
