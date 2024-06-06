import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Container, Header, Card, Image, Grid, Button, Icon } from "semantic-ui-react";
import correctSound from "../sounds/correct.mp3";
import wrongSound from "../sounds/wrong.mp3";
import { questionSessionStore } from "../store/questionSessionStore";

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const Assessment = observer(({ questions, handleNext, isLastPart }) => {
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [attempted, setAttempted] = useState(false); // New state to track if the question has been attempted

  const handleImageClick = (correct) => {
    const sound = correct ? correctSound : wrongSound;
    const feedbackMessage = correct ? "Correct!" : "You are wrong! Try again";
    const feedbackCorrect = correct;
    new Audio(sound).play();
    setFeedback({ message: feedbackMessage, correct: feedbackCorrect });

    if (correct && !attempted) {
      questionSessionStore.incrementScore(); // Update the score in the store if the answer is correct on the first try
    }

    setAttempted(true); // Set attempted to true after the first click
  };

  const handlePlayAudio = () => {
    const audioUrl = getAudioUrl(generatedQuestions[currentIndex].audio1);
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleContinue = () => {
    if (feedback.correct) {
      setFeedback(null);
      if (currentIndex < generatedQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setAttempted(false); // Reset attempted for the next question
      } else {
        handleNext(); // Call handleNext to proceed to the next step or show confetti
      }
    } else {
      const updatedQuestions = [...generatedQuestions];
      updatedQuestions[currentIndex].options = shuffleArray(updatedQuestions[currentIndex].options);
      setGeneratedQuestions(updatedQuestions);
      setFeedback(null);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    const fileName = imagePath.split("/").slice(-2, -1)[0] + ".jpg";
    return `http://localhost:3000/aws/data/${imagePath}right/${fileName}`;
  };

  const getAudioUrl = (audioPath) => {
    if (!audioPath) return "";
    const fileName = audioPath.split("/").slice(-2, -1)[0] + ".mp3";
    return `http://localhost:3000/aws/data/${audioPath}${fileName}`;
  };

  useEffect(() => {
    const fetchGeneratedQuestions = async () => {
      try {
        const response = await fetch("http://localhost:3000/v1/generate-questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ questions }),
        });
        const data = await response.json();

        const shuffledQuestions = data.map((question) => ({
          ...question,
          options: shuffleArray(question.options),
        }));

        setGeneratedQuestions(shuffledQuestions);
      } catch (error) {
        console.error("Error fetching generated questions:", error);
      }
    };

    fetchGeneratedQuestions();
  }, []);

  useEffect(() => {
    if (generatedQuestions.length > 0 && currentIndex < generatedQuestions.length) {
      handlePlayAudio();
    }
  }, [currentIndex, generatedQuestions]);

  return (
    <Container fluid style={{ padding: '0', margin: '0', height: 'auto', alignItems: 'center', justifyContent: 'center', background: '#fff', position: 'relative' }}>
      <div style={{ width: '100%', height: 'auto', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: '600px', height: 'auto', position: 'relative' }}>
          {generatedQuestions.length > 0 && currentIndex < generatedQuestions.length && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Header as="h1" textAlign="center" style={{ fontSize: '1.8em', color: '#333', margin: '0' }}>
                  {generatedQuestions[currentIndex].text}
                </Header>
                <Button icon='volume up' onClick={handlePlayAudio} style={{ marginLeft: '10px' }} />
              </div>
              <Grid columns={2} centered stackable style={{ marginBottom: "20px", position: 'relative', display: 'flex', justifyContent: 'center' }}>
                {generatedQuestions[currentIndex].options.map((option, idx) => (
                  <Grid.Column key={idx} style={{ padding: "10px", position: 'relative' }}>
                    <Card
                      onClick={() => handleImageClick(option.correct)}
                      style={{
                        cursor: "pointer",
                        borderRadius: "10px",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                        width: '350px',
                        height: '330px',
                        border: '2px solid #d1d1d1',
                        overflow: 'hidden'
                      }}
                    >
                      <Image
                        src={getImageUrl(option.image)}
                        style={{
                          height: '100%',
                          width: '100%',
                          objectFit: 'cover',
                          borderRadius: "10px",
                        }}
                      />
                    </Card>
                  </Grid.Column>
                ))}
              </Grid>
            </>
          )}
        </div>
      </div>
      {feedback && (
        <div
          style={{
            minWidth: '100%',
            padding: '20px',
            backgroundColor: feedback.correct ? '#d4edda' : '#f8d7da',
            color: feedback.correct ? '#155724' : '#721c24',
            textAlign: 'center',
            position: 'sticky',
            bottom: '-3px',
            left: '0',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <Icon name={feedback.correct ? "check circle outline" : "times circle outline"} size="large" />
          <div style={{ fontSize: '1.2em', marginBottom: '10px' }}>{feedback.message}</div>
          <Button
            color={feedback.correct ? "green" : "red"}
            onClick={handleContinue}
            style={{ width: '150px' }}
          >
            {currentIndex === generatedQuestions.length - 1 && isLastPart ? "Finish" : "Continue"}
          </Button>
        </div>
      )}
    </Container>
  );
});

export default Assessment;
