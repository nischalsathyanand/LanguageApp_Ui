import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Header, Image, Button, Card, Transition, Message } from 'semantic-ui-react';
import { questionSessionStore } from '../store/questionSessionStore'; // Import the MobX store

const Training = observer(({ handleNext }) => {
  const { questions } = questionSessionStore;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [buttonText, setButtonText] = useState('START');

  const handleTrainingNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setButtonText('CONTINUE');
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

  const getImageUrl = (imagePath) => {
    const fileName = imagePath.split('/').slice(-2, -1)[0] + '.jpg';
    return `http://localhost:3000/aws/data/${imagePath}right/${fileName}`;
  };

  const getAudioUrl = (audioPath) => {
    const fileName = audioPath.split('/').slice(-2, -1)[0] + '.mp3';
    return `http://localhost:3000/aws/data/${audioPath}${fileName}`;
  };

  return (
    <Container textAlign="center" style={{ padding: '40px' }}>
      {questions.length > 0 && currentIndex < questions.length && (
        <div style={{ margin: '0 auto', maxWidth: '600px' }}>
          <Header as="h1" style={{ marginBottom: '30px', fontSize: '2.5em', color: '#333' }}>
            {questions[currentIndex].text}
          </Header>
          <Card centered style={{ width: '350px', height: '350px', margin: '0 auto', marginBottom: '30px' }}>
            <Transition animation="fade" duration={500} visible={true}>
              <Image src={getImageUrl(questions[currentIndex].image1)} style={{ height: '100%', objectFit: 'cover' }} />
            </Transition>
          </Card>
          <div style={{ margin: '30px 0' }}>
            <Button circular icon={audioPlaying ? 'pause' : 'play'} onClick={handlePlayAudio} primary size='large' />
            <Button circular icon='refresh' onClick={() => setAudioPlaying(false)} primary size='large' style={{ marginLeft: '15px' }} />
          </div>
          <Button size="huge" onClick={handleTrainingNext} primary style={{ padding: '15px 30px' }}>
            {buttonText}
          </Button>
          <audio id="trainingAudio" src={getAudioUrl(questions[currentIndex].audio1)} autoPlay />
        </div>
      )}
      {questions.length === 0 && <Message>No training material available.</Message>}
    </Container>
  );
});

export default Training;
