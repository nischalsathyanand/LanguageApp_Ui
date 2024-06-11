import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Message,
  Dimmer,
  Loader,
  Modal,
  Button,
  Image,
} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'; // Import Semantic UI CSS
import './styles.css'; // Import the custom CSS

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
    <Container fluid className="table-container">
      {loading && (
        <Dimmer active inverted>
          <Loader size="large">Loading...</Loader>
        </Dimmer>
      )}
      {error && (
        <Message negative>
          <Message.Header>Error:</Message.Header>
          <p>{error}</p>
        </Message>
      )}
      {!loading && !error && (
        <>
          <Table className="custom-table" celled striped selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Student Name</Table.HeaderCell>
                <Table.HeaderCell>UserId</Table.HeaderCell>
                <Table.HeaderCell>Class</Table.HeaderCell>
                <Table.HeaderCell>Section</Table.HeaderCell>
                <Table.HeaderCell>DOB</Table.HeaderCell>
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
                  <Table.Cell>{student.phone}</Table.Cell>
                  <Table.Cell>{student.rollno}</Table.Cell>
                  <Table.Cell>{student.instituteName}</Table.Cell>
                  <Table.Cell>{student.password}</Table.Cell>
                  <Table.Cell>{student.lastLoggedInTime}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {selectedStudent && (
            <Modal
              open={!!selectedStudent}
              onClose={handleClose}
              size="large"
              style={{ width: "100%", maxWidth: "none", height: "100vh" }}
            >
              <Modal.Header style={{ textAlign: "center" }}>{selectedStudent.name}</Modal.Header>
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
                <Table className="custom-table" celled striped>
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
                </Table>
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
    </Container>
  );
};

export default ViewAllStudents;
