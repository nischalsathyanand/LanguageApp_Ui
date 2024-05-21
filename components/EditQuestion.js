import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Message } from "semantic-ui-react";

const EditQuestion = ({ question, open, onClose, onSuccess }) => {
  const [content, setContent] = useState(question.content);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setContent(question.content);
    setError("");
    setSuccess("");
    setLoading(false);
  }, [question]);

  const handleEditQuestion = () => {
    if (!content) {
      setError("Question content is required");
      return;
    }

    setLoading(true);

    const payload = {
      content: content,
    };

    fetch(`http://localhost:3000/api/v1/questions/${question._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update question");
        }
        setSuccess("Question updated successfully");
        onSuccess(); // Refresh questions after update
        onClose();
      })
      .catch((error) => {
        console.error("Error updating question:", error);
        setError("Failed to update question. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteQuestion = () => {
    setLoading(true);

    fetch(`http://localhost:3000/api/v1/questions/${question._id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete question");
        }
        setSuccess("Question deleted successfully");
        onSuccess(); // Refresh questions after delete
        onClose();
      })
      .catch((error) => {
        console.error("Error deleting question:", error);
        setError("Failed to delete question. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Edit Question</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Content</label>
            <input
              placeholder="Question Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
        <Button positive onClick={handleEditQuestion} loading={loading}>
          Update
        </Button>
        <Button negative onClick={handleDeleteQuestion} loading={loading}>
          Delete
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default EditQuestion;
