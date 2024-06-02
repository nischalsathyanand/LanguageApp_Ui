import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Header, Segment, Image, Grid, Button } from 'semantic-ui-react';
import FeedbackComponent from './FeedbackComponent';

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const Assessment = observer(({ questions, onAssessmentComplete }) => {
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleImageClick = (correct) => {
    setIsCorrect(correct);
    if (correct) {
      setFeedbackMessage('Correct answer!');
    } else {
      setFeedbackMessage('Incorrect answer. Try again.');
      const updatedQuestions = [...generatedQuestions];
      updatedQuestions[currentIndex].options = shuffleArray(updatedQuestions[currentIndex].options);
      setGeneratedQuestions(updatedQuestions);
    }
    setShowFeedback(true);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    const fileName = imagePath.split('/').slice(-2, -1)[0] + '.jpg'; // Adjusted to get the last part of the path
    return `http://localhost:3000/aws/data/${imagePath}right/${fileName}`;
  };

  const getAudioUrl = (audioPath) => {
    if (!audioPath) return '';
    const fileName = audioPath.split('/').slice(-2, -1)[0] + '.mp3'; // Adjusted to get the last part of the path
    return `http://localhost:3000/aws/data/${audioPath}${fileName}`;
  };

  useEffect(() => {
    const fetchGeneratedQuestions = async () => {
      try {
        const response = await fetch('http://localhost:3000/v1/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ questions }),
        });
        const data = await response.json();
        console.log(data); // Log data here to check it once

        // Shuffle options for each question
        const shuffledQuestions = data.map((question) => ({
          ...question,
          options: shuffleArray(question.options),
        }));

        setGeneratedQuestions(shuffledQuestions);
      } catch (error) {
        console.error('Error fetching generated questions:', error);
      }
    };

    // Fetch data only once on component mount
    fetchGeneratedQuestions();
  }, []);

  const handleNextQuestion = () => {
    if (isCorrect) {
      if (currentIndex < generatedQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowFeedback(false);
        setFeedbackMessage('');
      } else {
        onAssessmentComplete(); // Call the onAssessmentComplete callback to update score or handle completion
      }
    } else {
      setShowFeedback(false);
      setFeedbackMessage('');
    }
  };

  return (
    <Container textAlign="center" style={{ padding: '40px', background: '#f7f7f7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {generatedQuestions.length > 0 && currentIndex < generatedQuestions.length ? (
        <Segment raised style={{ padding: '40px', borderRadius: '10px', width: '100%', maxWidth: '800px', textAlign: 'center', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
          <Header as="h1" style={{ marginBottom: '30px', fontSize: '2.5em', color: '#333' }}>
            {generatedQuestions[currentIndex].text}
          </Header>
          <Grid columns={2} centered stackable style={{ marginBottom: '30px' }}>
            {generatedQuestions[currentIndex].options.map((option, idx) => (
              <Grid.Column key={idx} style={{ padding: '10px' }}>
                <Segment onClick={() => handleImageClick(option.correct)} style={{ cursor: 'pointer', padding: '0', borderRadius: '10px', overflow: 'hidden' }}>
                  <Image src={getImageUrl(option.image)} style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '10px' }} />
                </Segment>
              </Grid.Column>
            ))}
          </Grid>
          {showFeedback && (
            <Segment raised style={{ marginTop: '20px', borderRadius: '10px', textAlign: 'center', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
              <Header as="h3" style={{ marginBottom: '10px', fontSize: '1.5em', color: '#333' }}>
                {feedbackMessage}
              </Header>
              <Button primary onClick={handleNextQuestion}>Next</Button>
            </Segment>
          )}
          <audio id="assessmentAudio" src={getAudioUrl(generatedQuestions[currentIndex].audio1)} autoPlay />
        </Segment>
      ) : (
        <Segment raised style={{ padding: '40px', borderRadius: '10px', maxWidth: '600px', textAlign: 'center', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
          <Header as="h2" style={{ marginBottom: '30px', fontSize: '1.5em', color: '#333' }}>
            No assessment material available.
          </Header>
        </Segment>
      )}
    </Container>
  );
});

export default Assessment;
