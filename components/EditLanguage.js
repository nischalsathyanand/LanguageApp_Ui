import React, { useState } from "react";
import { Modal, Form, Button, Message } from "semantic-ui-react";

const EditLanguage = ({ language, open, onClose, onSuccess, onDelete }) => {
  const [editLanguageName, setEditLanguageName] = useState(language.name || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEditLanguage = () => {
    if (!editLanguageName) {
      setError("Language name is required");
      return;
    }

    fetch(`/api/v1/languages/${language._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: editLanguageName }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update language");
        }
        setSuccess("Language updated successfully");
        onSuccess(); // Refresh languages after update
      })
      .catch((error) => {
        console.error("Error updating language:", error);
        setError("Failed to update language");
      });
  };

  const handleDeleteLanguage = () => {
    fetch(`/api/v1/languages/${language._id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete language");
        }
        setSuccess("Language deleted successfully");
        onDelete(); // Navigate to edit course page after delete
      })
      .catch((error) => {
        console.error("Error deleting language:", error);
        setError("Failed to delete language");
      });
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Edit Language</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Enter New Language Name</label>
            <input
              placeholder="Language Name"
              value={editLanguageName}
              onChange={(e) => setEditLanguageName(e.target.value)}
            />
          </Form.Field>
        </Form>
        {error && <Message negative>{error}</Message>}
        {success && <Message positive>{success}</Message>}
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={handleCancel}>
          Cancel
        </Button>
        <Button positive onClick={handleEditLanguage}>
          Rename
        </Button>
        <Button negative onClick={handleDeleteLanguage}>
          Delete
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default EditLanguage;
