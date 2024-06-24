import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Container, Header, Card, Image, Grid, Button, Icon } from "semantic-ui-react";
import correctSound from "../sounds/correct.mp3";
import wrongSound from "../sounds/wrong.mp3";
import { questionSessionStore } from "../store/questionSessionStore";

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const Assessment = observer(({ questions, handleNext, isLastPart, selectedLessonId, selectedChapterId, username, completedTime,selectedChapterName,selectedLessonName}) => {
 
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [attempted, setAttempted] = useState(false);

  const handleImageClick = (correct) => {
    const sound = correct ? correctSound : wrongSound;
    const feedbackMessage = correct ? "Correct!" : "You are wrong! Try again";
    const feedbackCorrect = correct;
    new Audio(sound).play();
    setFeedback({ message: feedbackMessage, correct: feedbackCorrect });

    if (correct && !attempted) {
      questionSessionStore.incrementScore();
    }

    setAttempted(true);
  };

  const handlePlayAudio = () => {
    const audioUrl = getAudioUrl(generatedQuestions[currentIndex].audio1);
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleContinue = async () => {
    if (feedback.correct) {
      setFeedback(null);
      if (currentIndex < generatedQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setAttempted(false);
      } else {
        if (isLastPart) {
         
          await updateCompletedChapters(username, selectedChapterName,selectedChapterId,selectedLessonName,selectedLessonId, questionSessionStore.score, completedTime);
          console.log(updateCompletedChapters)
        }
        handleNext();
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
    return `/aws/data/${imagePath}right/${fileName}`;
  };

  const getAudioUrl = (audioPath) => {
    if (!audioPath) return "";
    const fileName = audioPath.split("/").slice(-2, -1)[0] + ".mp3";
    return `/aws/data/${audioPath}${fileName}`;
  };

  const updateCompletedChapters = async (username,chapter_name, chapter_id, lesson_name,lesson_id, score,completedTime ) => {
    try {
   
      const response = await fetch(`/user/${username}/completedChapters`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chapter_name,chapter_id, lesson_name,lesson_id, score, completedTime }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update completed chapters');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating completed chapters:', error);
    }
  };
  

  useEffect(() => {
    const fetchGeneratedQuestions = async () => {
      try {
        const response = await fetch("/v1/generate-questions", {
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
    <Container fluid style={{ padding: '0', margin: '0', maxHeight:'77vh', alignItems: 'center', justifyContent: 'center', background: '#fff', position: 'absolute' }}>
      <div style={{ width: '100%', maxHeight:'100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: '500px', maxHeight: '77vh', position: 'relative',display:'flex',flexDirection:'column' }}>
          {generatedQuestions.length > 0 && currentIndex < generatedQuestions.length && (
            <div style={{display:"flex",flexDirection:'column',justifyContent:'center',alignItems:'center',position:'relative',maxHeight:'75vh',padding:'0px',margin:'0px'}}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px',maxBlockSize:'100%',position:'relative',maxHeight:'7vh' }}>
                <Header as="h1" textAlign="center" style={{ fontSize: '1.8em', color: '#333', margin: '0',position:'relative' }}>
                  {generatedQuestions[currentIndex].text}
                </Header>
                <Button icon='volume up' onClick={handlePlayAudio} style={{ marginLeft: '10px' }} />
              </div>
              <Grid columns={2} centered stackable style={{ marginBottom: "10px", position: 'relative', display: 'flex', justifyContent: 'center',alignItems:'center',maxHeight:'93vh' }}>
                {generatedQuestions[currentIndex].options.map((option, idx) => (
                  <Grid.Column key={idx} style={{ padding: "10px", position: 'relative',display:'flex',justifyContent:'center',alignItems:'center',maxHeight:'93vh' }}>
                    <Card
                      onClick={() => handleImageClick(option.correct)}
                      style={{
                        cursor: "pointer",
                        borderRadius: "10px",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                        width: '260px',
                        height: '250px',
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
              </div>
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
            position: 'fixed',
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
