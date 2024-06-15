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
  Icon,
  Input,
  Pagination,
  Dropdown,
} from "semantic-ui-react";
import styled from "styled-components";
import "semantic-ui-css/semantic.min.css";
import { saveAs } from "file-saver"; // Import file-saver

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
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-collapse: separate;
    border-spacing: 0 10px;
    font-size: 14px;
    color: #333;
  }
  &.ui.table thead th {
    background-color: #f1f3f5;
    color: #449bc0;
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
    color: #016fa4;
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
  color: #016da1;
`;
const formatChapterId = (chapterId) => {
  const parts = chapterId.split('_');
  return `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} ${parts[1]}`;
};

const formatLessonId = (lessonId) => {
  const parts = lessonId.split('_');
  return `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} ${parts[1]}`;
};


const ViewAllStudents = () => {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const classOptions = classes.map((cls) => ({
    key: cls,
    text: cls,
    value: cls,
  }));

  const sectionOptions = sections.map((sec) => ({
    key: sec,
    text: sec,
    value: sec,
  }));

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const instituteKey = sessionStorage.getItem("institutekey");
        const response = await fetch(
          `http://localhost:3000/user/v1/getstudentdetails?instituteKey=${instituteKey}&class=${selectedClass}&section=${selectedSection}`,
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

        const formattedStudents = data.studentDetails.map((student) => ({
          ...student,
          dob: formatDateOfBirth(student.dob),
          lastLoggedInTime: new Date(student.lastLoggedInTime).toLocaleString(),
        }));

        setStudents(formattedStudents);

        // Extract unique classes and sections

        setLoading(false);
      } catch (error) {
        console.error("Error fetching student details:", error);
        setError("Failed to fetch student details. Please try again.");
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClass, selectedSection]);

  useEffect(() => {
    const fetchAllStudents = async () => {
      setLoading(true);
      // setError(null);

      try {
        const token = localStorage.getItem("token");
        const instituteKey = sessionStorage.getItem("institutekey");
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
        if (!data) {
          throw new Error("No student details found");
        }

        setAllStudents(data);
        const formattedStudents = data.studentDetails.map((student) => ({
          ...student,
          dob: formatDateOfBirth(student.dob),
          lastLoggedInTime: new Date(student.lastLoggedInTime).toLocaleString(),
        }));

        // Extract unique classes and sections
        const uniqueClasses = [
          ...new Set(formattedStudents.map((student) => student.class)),
        ];
        const uniqueSections = [
          ...new Set(formattedStudents.map((student) => student.section)),
        ];

        setClasses(uniqueClasses);
        setSections(uniqueSections);

        // setLoading(false);
      } catch (error) {
        console.error("Error fetching student details:", error);
        setError("Failed to fetch student details. Please try again.");
        // setLoading(false);
      }
    };

    fetchAllStudents();
  }, [selectedClass, selectedSection]);

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
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const openConfirmationModal = (student) => {
    setStudentToDelete(student);
    setConfirmationOpen(true);
  };

  const closeConfirmationModal = () => {
    setStudentToDelete(null);
    setConfirmationOpen(false);
  };

  const confirmDelete = () => {
    handleDelete(studentToDelete._id);
    closeConfirmationModal();
  };

  const handleClassChange = (e, { value }) => {
    setSelectedClass(value);
    // Optionally, you can filter students by the selected class here
  };

  const handleSectionChange = (e, { value }) => {
    setSelectedSection(value);
    // Optionally, you can filter students by the selected section here
  };

  // const filteredStudents = students.filter((student) => {
  //   return (
  //     (selectedClass === "" || student.class === selectedClass) &&
  //     (selectedSection === "" || student.section === selectedSection) &&
  //     (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       student.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       student.email.toLowerCase().includes(searchTerm.toLowerCase()))
  //   );
  // });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const handlePageChange = (event, data) => {
    setCurrentPage(data.activePage);
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");
      const instituteKey = sessionStorage.getItem("institutekey");
      const response = await fetch(
        `http://localhost:3000/user/v1/download?instituteKey=${instituteKey}&class=${selectedClass}&section=${selectedSection}&format=csv`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download student details");
      }

      const blob = await response.blob();
      saveAs(blob, "student_details.csv");
      setError("");
      setSelectedClass("");
      setSelectedSection("");
    } catch (error) {
      console.error("Error downloading student details:", error);
      setError("Failed to download student details. Please try again.");
    }
  };

  return (
    <StyledContainer fluid>
      <Heading>Student Dashboard</Heading>

      <Dropdown
        placeholder="Select Class"
        selection
        options={classOptions}
        onChange={handleClassChange}
      />
      <Dropdown
        placeholder="Select Section"
        selection
        options={sectionOptions}
        onChange={handleSectionChange}
      />

      <Button onClick={handleDownload} color="green">
        <Icon name="download" /> Download Student Details
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
                <Table.HeaderCell>Sl No</Table.HeaderCell>
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
                <Table.HeaderCell></Table.HeaderCell>

              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentStudents.map((student, index) => (
                <Table.Row
                  key={student._id}
                  onDoubleClick={() => handleRowClick(student)}
                >
                  <Table.Cell>{indexOfFirstStudent + index + 1}</Table.Cell>
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
                  <Table.Cell>
                    <Icon
                      name="eye"
                      link
                      onClick={() => handleRowClick(student)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </StyledTable>

          <Pagination
            activePage={currentPage}
            onPageChange={handlePageChange}
            totalPages={Math.ceil(students.length / studentsPerPage)}
            boundaryRange={0}
            siblingRange={1}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            prevItem={{ content: <Icon name="angle left" />, icon: true }}
            nextItem={{ content: <Icon name="angle right" />, icon: true }}
            style={{ marginTop: "20px" }}
          />

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
                        <Table.Cell>{formatChapterId(chapter.chapter_id)}</Table.Cell>
                        <Table.Cell>
                          <ul>
                            {chapter.completedLessons.map((lesson) => (
                              <li key={lesson._id}>{formatLessonId(lesson.lesson_id)}</li>
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
                  onClick={() => openConfirmationModal(selectedStudent)}
                >
                  Delete Student
                </Button>
              </Modal.Actions>
            </Modal>
          )}

          <Modal
            size="mini"
            open={confirmationOpen}
            onClose={closeConfirmationModal}
          >
            <Modal.Header>Confirm Delete</Modal.Header>
            <Modal.Content>
              <p>Are you sure you want to delete this student?</p>
            </Modal.Content>
            <Modal.Actions>
              <Button negative onClick={closeConfirmationModal}>
                No
              </Button>
              <Button positive onClick={confirmDelete}>
                Yes
              </Button>
            </Modal.Actions>
          </Modal>
        </>
      )}
    </StyledContainer>
  );
};

export default ViewAllStudents;
