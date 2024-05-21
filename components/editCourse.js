import React, { useState, useEffect } from "react";
import { Dropdown, Icon, Grid, Segment, Header, Message } from "semantic-ui-react";
import EditLanguage from "./EditLanguage";
import EditChapter from "./EditChapter";

const EditCourse = () => {
  const [languages, setLanguages] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [editLanguageModalOpen, setEditLanguageModalOpen] = useState(false);
  const [editChapterModalOpen, setEditChapterModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = () => {
    fetch("http://localhost:3000/api/v1/languages")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch languages");
        }
        return response.json();
      })
      .then((data) => {
        setLanguages(data);
      })
      .catch((error) => {
        console.error("Error fetching languages:", error);
        setError("Failed to fetch languages");
      });
  };

  const fetchChapters = (languageId) => {
    fetch(`http://localhost:3000/api/v1/languages/${languageId}/chapters`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch chapters");
        }
        return response.json();
      })
      .then((data) => {
        setChapters(data);
      })
      .catch((error) => {
        console.error("Error fetching chapters:", error);
        setError("Failed to fetch chapters");
      });
  };

  const handleEditLanguageModalOpen = (language) => {
    setSelectedLanguage(language._id);
    setEditLanguageModalOpen(true);
  };

  const handleEditLanguageModalClose = () => {
    setEditLanguageModalOpen(false);
    setSelectedLanguage("");
    setSuccess("");
    setError("");
  };

  const handleEditChapterModalOpen = (chapter) => {
    setSelectedChapter(chapter._id);
    setEditChapterModalOpen(true);
  };

  const handleEditChapterModalClose = () => {
    setEditChapterModalOpen(false);
    setSelectedChapter("");
    setSuccess("");
    setError("");
  };

  const handleSuccess = () => {
    setSuccess("Operation successful.");
    setTimeout(() => {
      setSuccess("");
    }, 3000);
    fetchLanguages(); // Refresh languages after edit or delete
  };

  const handleDeleteChapter = () => {
    fetch(`http://localhost:3000/api/v1/chapters/${selectedChapter}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete chapter");
        }
        setSuccess("Chapter deleted successfully");
        handleEditChapterModalClose();
        fetchChapters(selectedLanguage);
      })
      .catch((error) => {
        console.error("Error deleting chapter:", error);
        setError("Failed to delete chapter");
      });
  };

  const handleLanguageChange = (e, { value }) => {
    setSelectedLanguage(value);
    fetchChapters(value);
    setSelectedChapter(""); // Reset selected chapter when language changes
  };

  const handleChapterChange = (e, { value }) => {
    setSelectedChapter(value);
  };

  const createOptions = (data) =>
    data.map((item) => ({
      key: item._id,
      text: item.name,
      value: item._id,
    }));

  return (
    <Grid textAlign="center" verticalAlign="middle" style={{ marginTop: "20px" }}>
      <Grid.Column style={{ maxWidth: "600px" }}>
        <Segment
          raised
          style={{
            width: "100%",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#f9f9f9",
            padding: "20px",
          }}
        >
          <Header as="h2" textAlign="left" style={{ color: "#0084FF" }}>
            <Icon name="edit" color="blue" />
            <Header.Content>
              Edit Language and Chapters
              <Header.Subheader>Select a language and chapter to edit or delete</Header.Subheader>
            </Header.Content>
          </Header>

          <div style={{ marginBottom: "20px" }}>
            <Dropdown
              placeholder="Select Language"
              fluid
              selection
              options={createOptions(languages)}
              onChange={handleLanguageChange}
              value={selectedLanguage}
              style={{ minWidth: "200px", marginRight: "10px" }}
            />

            <Icon
              name="edit"
              color="blue"
              style={{ cursor: "pointer" }}
              onClick={() =>
                selectedLanguage
                  ? handleEditLanguageModalOpen(languages.find((lang) => lang._id === selectedLanguage))
                  : null
              }
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <Dropdown
              placeholder="Select Chapter"
              fluid
              selection
              options={createOptions(chapters)}
              onChange={handleChapterChange}
              value={selectedChapter}
              style={{ minWidth: "200px", marginRight: "10px" }}
            />

            <Icon
              name="edit"
              color="blue"
              style={{ cursor: "pointer" }}
              onClick={() =>
                selectedChapter
                  ? handleEditChapterModalOpen(chapters.find((chap) => chap._id === selectedChapter))
                  : null
              }
            />
          </div>

          <EditLanguage
            language={languages.find((lang) => lang._id === selectedLanguage) || {}}
            open={editLanguageModalOpen}
            onClose={handleEditLanguageModalClose}
            onSuccess={handleSuccess}
          />

          <EditChapter
            chapter={chapters.find((chap) => chap._id === selectedChapter) || {}}
            languageId={selectedLanguage}
            open={editChapterModalOpen}
            onClose={handleEditChapterModalClose}
            onSuccess={() => {
              handleSuccess();
              fetchChapters(selectedLanguage); // Refresh chapters after edit
            }}
            onDelete={handleDeleteChapter}
          />

          {error && <Message negative>{error}</Message>}
          {success && <Message positive>{success}</Message>}
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default EditCourse;
