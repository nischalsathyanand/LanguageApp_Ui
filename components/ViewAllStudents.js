
import React, { useState, useEffect } from "react";
import { Container, Table, Message, Dimmer, Loader, Modal, Button, Image, Icon } from "semantic-ui-react";
import styled from 'styled-components';

const StyledContainer = styled(Container)`
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 100%;
`;

const StyledTable = styled(Table)`
  &.ui.table {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    border-collapse: separate;
    border-spacing: 0 10px;
    font-size: 14px;
    color: #333;
  }
  &.ui.table thead th {
    background-color: #f1f3f5;
    color: #449BC0;
    font-weight: bold;
    border-bottom: 2px solid #ddd;
  }
  &.ui.table tbody tr {
    background-color: #ffffff;
    transition: background-color 0.3s ease;
  }
  &.ui.table tbody tr:hover {
    background-color: #f9fafb;
  }
  &.ui.table tbody td {
    border-top: 1px solid #eee;
  }
  &.ui.table tbody tr:first-child td {
    border-top: none;
  }
`;

const StyledDimmer = styled(Dimmer)`
  &.ui.dimmer {
    background-color: rgba(255, 255, 255, 0.85);
  }
`;

const StyledLoader = styled(Loader)`
  &.ui.loader {
    color: #016FA4;
  }
`;

const StyledMessage = styled(Message)`
  &.ui.message {
    background-color: #fff6f6;
    color: #9f3a38;
    border: 1px solid #e0b4b4;
  }
`;

const Heading = styled.h1`
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  color:#016DA1;
`;

const ViewAllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const instituteKey = sessionStorage.getItem('institutekey');
        const response = await fetch(
          `http://localhost:3000/user/v1/getstudentdetails?instituteKey=${instituteKey}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch student details");
        }

        const data = await response.json();
        if (!data.studentDetails || !Array.isArray(data.studentDetails)) {
          throw new Error("No student details found");
        }

        const formattedStudents = data.studentDetails.map(student => ({
          ...student,
          dob: formatDateOfBirth(student.dob),
          lastLoggedInTime: new Date(student.lastLoggedInTime).toLocaleString(),
        }));

        setStudents(formattedStudents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student details:", error);
        setError("Failed to fetch student details. Please try again.");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/user/v1/deletestudent?studentId=${studentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      setError(null);

      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== studentId)
      );

      setSelectedStudent(null);
    } catch (error) {
      console.error("Error deleting student:", error);
      setError("Failed to delete student. Please try again.");
    }
  };

  const handleRowClick = (student) => {
    setSelectedStudent(student);
  };

  const handleClose = () => {
    setSelectedStudent(null);
  };

  const formatDateOfBirth = (dob) => {
    const date = new Date(dob);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <StyledContainer fluid>
       <Heading>
      Student Dashboard
        </Heading>
        <Button icon color="blue" style={{marginLeft: '10px' }}>
          <Icon name="download" />
        </Button>
        <Button icon color="green" style={{ marginLeft: '10px' }}>
          <Icon name="users" />
        </Button>
      
      {loading && (
        <StyledDimmer active inverted>
          <StyledLoader size="large">Loading...</StyledLoader>
        </StyledDimmer>
      )}
      {error && (
        <StyledMessage negative>
          <Message.Header>Error:</Message.Header>
          <p>{error}</p>
        </StyledMessage>
      )}
      {!loading && !error && (
        <>
          <StyledTable celled striped selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Student Name</Table.HeaderCell>
                <Table.HeaderCell>UserId</Table.HeaderCell>
                <Table.HeaderCell>Class</Table.HeaderCell>
                <Table.HeaderCell>Section</Table.HeaderCell>
                <Table.HeaderCell>DOB</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>PhoneNo</Table.HeaderCell>
                <Table.HeaderCell>RollNo</Table.HeaderCell>
                <Table.HeaderCell>Institute Name</Table.HeaderCell>
                <Table.HeaderCell>Password</Table.HeaderCell>
                <Table.HeaderCell>Last Login</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {students.map((student) => (
                <Table.Row
                  key={student._id}
                  onClick={() => handleRowClick(student)}
                >
                  <Table.Cell>{student.name}</Table.Cell>
                  <Table.Cell>{student.username}</Table.Cell>
                  <Table.Cell>{student.class}</Table.Cell>
                  <Table.Cell>{student.section}</Table.Cell>
                  <Table.Cell>{student.dob}</Table.Cell>
                  <Table.Cell>{student.email}</Table.Cell>
                  <Table.Cell>{student.phone}</Table.Cell>
                  <Table.Cell>{student.rollno}</Table.Cell>
                  <Table.Cell>{student.instituteName}</Table.Cell>
                  <Table.Cell>{student.password}</Table.Cell>
                  <Table.Cell>{student.lastLoggedInTime}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </StyledTable>

          {selectedStudent && (
            <Modal
              open={!!selectedStudent}
              onClose={handleClose}
              size="large"
              style={{ width: "100%", maxWidth: "none", height: "100vh" }}
            >
              <Modal.Header style={{ textAlign: "center" }}>
                {selectedStudent.name}
              </Modal.Header>
              <Modal.Content>
                <Button
                  icon="close"
                  onClick={handleClose}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: "1",
                    color: "black", // Change icon color to black
                  }}
                />
                <Image wrapped size="medium" src={selectedStudent.imageUrl} />
                <StyledTable celled striped>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Chapter ID</Table.HeaderCell>
                      <Table.HeaderCell>Completed Lessons</Table.HeaderCell>
                      <Table.HeaderCell>Score</Table.HeaderCell>
                      <Table.HeaderCell>Time Taken</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {selectedStudent.completedChapters.map((chapter) => (
                      <Table.Row key={chapter._id}>
                        <Table.Cell>{chapter.chapter_id}</Table.Cell>
                        <Table.Cell>
                          <ul>
                            {chapter.completedLessons.map((lesson) => (
                              <li key={lesson._id}>{lesson.lesson_id}</li>
                            ))}
                          </ul>
                        </Table.Cell>
                        <Table.Cell>
                          <ul>
                            {chapter.completedLessons.map((lesson) => (
                              <li key={lesson._id}>{lesson.score}</li>
                            ))}
                          </ul>
                        </Table.Cell>
                        <Table.Cell>
                          <ul>
                            {chapter.completedLessons.map((lesson) => (
                              <li key={lesson._id}>{lesson.completedTime}</li>
                            ))}
                          </ul>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </StyledTable>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={handleClose} basic color="blue">
                  Back
                </Button>
                <Button
                  floated="right"
                  color="red"
                  onClick={() => handleDelete(selectedStudent._id)}
                >
                  Delete Student
                </Button>
              </Modal.Actions>
            </Modal>
          )}
        </>
      )}
    </StyledContainer>
  );
};

export default ViewAllStudents;
