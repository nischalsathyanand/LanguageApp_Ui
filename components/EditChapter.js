import React, { useState } from "react";
import { Modal, Form, Button, Message } from "semantic-ui-react";

const EditChapter = ({ chapter, languageId, open, onClose, onSuccess, onDelete }) => {
  const [editChapterName, setEditChapterName] = useState(chapter.name || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEditChapter = () => {
    if (!editChapterName) {
      setError("Chapter name is required");
      return;
    }
  
    fetch(`http://localhost:3000/api/v1/languages/${languageId}/chapters/${chapter._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: editChapterName }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update chapter");
        }
        setSuccess("Chapter updated successfully");
        onSuccess(); // Refresh chapters after update
        onClose();
      })
      .catch((error) => {
        console.error("Error updating chapter:", error);
        setError("Failed to update chapter");
      });
  };

  const handleDeleteChapter = () => {
    fetch(`http://localhost:3000/api/v1/languages/${languageId}/chapters/${chapter._id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete chapter");
        }
        setSuccess("Chapter deleted successfully");
        onSuccess(); // Refresh chapters after delete
        onClose();
      })
      .catch((error) => {
        console.error("Error deleting chapter:", error);
        setError("Failed to delete chapter");
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Edit Chapter</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Enter New Chapter Name</label>
            <input
              placeholder="Chapter Name"
              value={editChapterName}
              onChange={(e) => setEditChapterName(e.target.value)}
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
        <Button positive onClick={handleEditChapter}>
          Update
        </Button>
        <Button negative onClick={handleDeleteChapter}>
          Delete
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default EditChapter;
