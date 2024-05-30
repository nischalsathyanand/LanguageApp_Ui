import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Header, Card, Button, Message, Icon } from 'semantic-ui-react';

const getFullImageUrl = (imagePath) => {
  const segments = imagePath.split('/');
  const imageName = segments[segments.length - 2] + '.jpg';
  return `http://localhost:3000/aws/data/${imagePath}right/${imageName}`;
};

const getFullAudioUrl = (audioPath) => {
  const segments = audioPath.split('/');
  const audioName = segments[segments.length - 2] + '.mp3';
  return `http://localhost:3000/aws/data/${audioPath}${audioName}`;
};

const Assessment = observer(({ questions, handleNext }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    if (selectedOption && selectedOption.correct && selectedOption.audio) {
      const audioUrl = getFullAudioUrl(selectedOption.audio);
      setAudio(new Audio(audioUrl));
    }
  }, [selectedOption]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsCorrect(option.correct);

    if (option.correct) {
      setScore(score + 1);
      const audioUrl = getFullAudioUrl(option.audio); // Assuming `option.audio` contains the correct audio path
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleAudioPlay = () => {
    const correctOption = questions[currentIndex].options.find(option => option.correct);
    if (correctOption && correctOption.audio) {
      const audioUrl = getFullAudioUrl(correctOption.audio);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setAudio(null);
    } else {
      setCompleted(true);
    }
  };

  return (
    <Container textAlign="center" style={{ padding: '40px' }}>
      {completed ? (
        <Message success>
          <Message.Header>Assessment Completed!</Message.Header>
          <p>Your score is: {score} / {questions.length}</p>
          <Button primary onClick={handleNext}>Next</Button>
        </Message>
      ) : (
        <div style={{ margin: '0 auto', maxWidth: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px' }}>
            <Header as="h1" style={{ fontSize: '2.5em', color: '#333', flex: 1 }}>
              {questions[currentIndex].text}
            </Header>
            <Button icon onClick={handleAudioPlay} style={{ marginLeft: '10px' }}>
              <Icon name='volume up' />
            </Button>
          </div>
          <Card.Group centered>
            {questions[currentIndex].options.map((option, index) => (
              <Card
                key={index}
                onClick={() => handleOptionClick(option)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedOption === option ? (option.correct ? '#d4edda' : '#f8d7da') : '#fff',
                  borderColor: selectedOption === option ? (option.correct ? '#c3e6cb' : '#f5c6cb') : '#ddd',
                }}
              >
                <Card.Content>
                  <Card.Description>
                    <img src={getFullImageUrl(option.image)} alt="option" style={{ width: '100%' }} />
                  </Card.Description>
                </Card.Content>
                {selectedOption === option && (
                  <Icon
                    name={option.correct ? 'check circle' : 'times circle'}
                    color={option.correct ? 'green' : 'red'}
                    size="large"
                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                  />
                )}
              </Card>
            ))}
          </Card.Group>
          {isCorrect !== null && (
            <Message success={isCorrect} error={!isCorrect}>
              <Message.Header>{isCorrect ? 'Correct Answer!' : 'Wrong Answer!'}</Message.Header>
              <Button primary onClick={handleNextQuestion} style={{ marginTop: '20px' }}>
                Continue
              </Button>
            </Message>
          )}
        </div>
      )}
    </Container>
  );
});

export default Assessment;
