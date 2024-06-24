import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Message, Dropdown } from "semantic-ui-react";

const EditLesson = ({ lesson, open, onClose, onSuccess, chapters }) => {
  const [name, setName] = useState(lesson.name);
  const [chapterId, setChapterId] = useState(lesson.chapterId);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(lesson.name);
    setChapterId(lesson.chapterId);
    setError("");
    setSuccess("");
    setLoading(false);
  }, [lesson]);

  const handleEditLesson = () => {
    if (!name || !chapterId) {
      setError("Name and Chapter are required");
      return;
    }

    setLoading(true);

    const payload = {
      name: name,
      chapterId: chapterId,
    };

    fetch(`/api/v1/lessons/${lesson._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update lesson");
        }
        setSuccess("Lesson updated successfully");
        onSuccess(); // Refresh lessons after update
        onClose();
      })
      .catch((error) => {
        console.error("Error updating lesson:", error);
        setError("Failed to update lesson. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteLesson = () => {
    setLoading(true);

    fetch(`/api/v1/lessons/${lesson._id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete lesson");
        }
        setSuccess("Lesson deleted successfully");
        onSuccess(); // Refresh lessons after delete
        onClose();
      })
      .catch((error) => {
        console.error("Error deleting lesson:", error);
        setError("Failed to delete lesson. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChapterChange = (_, { value }) => {
    setChapterId(value);
  };

  const createChapterOptions = (chapters) =>
    chapters.map((chap) => ({
      key: chap._id,
      text: chap.name,
      value: chap._id,
    }));

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Edit Lesson</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Name</label>
            <input
              placeholder="Lesson Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Chapter</label>
            <Dropdown
              placeholder="Select Chapter"
              fluid
              selection
              options={createChapterOptions(chapters)}
              onChange={handleChapterChange}
              value={chapterId}
              disabled={chapters.length === 0}
            />
          </Form.Field>
        </Form>
        {error && <Message negative>{error}</Message>}
        {success && <Message positive>{success}</Message>}
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={onClose}>
          Cancel
        </Button>
        <Button positive onClick={handleEditLesson} loading={loading}>
          Update
        </Button>
        <Button negative onClick={handleDeleteLesson} loading={loading}>
          Delete
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default EditLesson;
