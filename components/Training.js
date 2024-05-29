import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Header, Image, Button, Card, Transition, Message, Icon } from 'semantic-ui-react';
import { questionSessionStore } from '../store/questionSessionStore'; // Import the MobX store

const Training = observer(({ handleNext }) => {
  const { questions } = questionSessionStore;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const handleTrainingNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleNext();
    }
  };

  const handlePlayAudio = () => {
    const audioElement = document.getElementById('trainingAudio');
    if (audioElement.paused) {
      audioElement.play();
      setAudioPlaying(true);
    } else {
      audioElement.pause();
      setAudioPlaying(false);
    }
  };

  useEffect(() => {
    const audioElement = document.getElementById('trainingAudio');
    if (audioElement && !audioElement.paused) {
      setAudioPlaying(true);
    }
  }, [currentIndex]);

  useEffect(() => {
    const audioElement = document.getElementById('trainingAudio');
    if (audioElement && audioElement.paused && audioPlaying) {
      audioElement.play();
    }
  }, [audioPlaying]);

  return (
    <Container textAlign="center">
      {questions.length > 0 && currentIndex < questions.length && (
        <div>
          <Header style={{ textTransform: 'uppercase' }}>
            {questions[currentIndex].text}
            {questions[currentIndex].image1}
        
          </Header>
          <Card centered>
            <Transition animation='drop' duration='500' visible={true}>
              <Image bordered src={`http://localhost:3000/aws/data/${questions[currentIndex].image1}`} />
            </Transition>
          </Card>
          <audio id="trainingAudio" src={`http://localhost:3000/aws/data/${questions[currentIndex].audio1}`} autoPlay />
          <Button circular icon={audioPlaying ? 'pause' : 'play'} onClick={handlePlayAudio} primary style={{ margin: '1em', fontSize: '2em' }} />
          <div>
            <Button size="huge" onClick={handleTrainingNext} primary>Next</Button>
          </div>
        </div>
      )}
      {questions.length === 0 && <Message>No training material available.</Message>}
    </Container>
  );
});

export default Training;
