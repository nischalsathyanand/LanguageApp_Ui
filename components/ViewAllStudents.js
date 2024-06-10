import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Header,
  Message,
  Dimmer,
  Loader,
  Icon,
  Card,
  Button,
  Image, // Import the Image component
} from "semantic-ui-react";

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

        // Convert timestamp to a normal format for last login time
        const formattedStudents = data.studentDetails.map(student => ({
          ...student,
          lastLoggedInTime: new Date(student.lastLoggedInTime).toLocaleString()
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
  
      // Reset error state when deletion is successful
      setError(null);
  
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== studentId)
      );
  
      // Navigate back to the main table
      setSelectedStudent(null);
    } catch (error) {
      console.error("Error deleting student:", error);
      setError("Failed to delete student. Please try again.");
    }
  };
  
  const handleRowClick = (student) => {
    setSelectedStudent(student);
  };

  const handleBackButtonClick = () => {
    setSelectedStudent(null);
  };

  return (
    <Container>
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
          {!selectedStudent ? (
            <Table celled striped selectable textAlign="center">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Student Name</Table.HeaderCell>
                  <Table.HeaderCell>User Name</Table.HeaderCell>
                  <Table.HeaderCell>Class</Table.HeaderCell>
                  <Table.HeaderCell>Address</Table.HeaderCell>
                  <Table.HeaderCell>Institute Name</Table.HeaderCell>
                  <Table.HeaderCell>Last Login</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {students.map((student) => (
                  <Table.Row key={student._id} onClick={() => handleRowClick(student)}>
                    <Table.Cell>{student.name}</Table.Cell>
                    <Table.Cell>{student.username}</Table.Cell>
                    <Table.Cell>{student.class}</Table.Cell>
                    <Table.Cell>{student.address}</Table.Cell>
                    <Table.Cell>{student.instituteName}</Table.Cell>
                    <Table.Cell>{student.lastLoggedInTime}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <Card fluid>
              <Card.Content>
                <Card.Header textAlign="center">{selectedStudent.name}</Card.Header>
                <Image src={selectedStudent.imageUrl} centered /> {/* Student image */}
                <Card.Description>
                  <Table celled striped>
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
                                <li key={lesson._id}>
                                  {lesson.lesson_id}
                                </li>
                              ))}
                            </ul>
                          </Table.Cell>
                          <Table.Cell>
                            <ul>
                              {chapter.completedLessons.map((lesson) => (
                                <li key={lesson._id}>
                                  {lesson.score}
                                </li>
                              ))}
                            </ul>
                          </Table.Cell>
                          <Table.Cell>
                            <ul>
                              {chapter.completedLessons.map((lesson) => (
                                <li key={lesson._id}>
                                  {lesson.completedTime}
                                </li>
                              ))}
                            </ul>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Button onClick={handleBackButtonClick} basic color="blue">
                  Back
                </Button>
                <Button
                  floated="right"
                  color="red"
                  onClick={() => handleDelete(selectedStudent._id)}
                >
                  Delete Student
                </Button>
              </Card.Content>
            </Card>
          )}
        </>
      )}
    </Container>
  );
};

export default ViewAllStudents;
