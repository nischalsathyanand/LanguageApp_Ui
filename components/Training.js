import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, Header, Image, Button, Card, Transition, Message } from 'semantic-ui-react';

const Training = observer(({ questions, handleNext }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [buttonText, setButtonText] = useState('START');
  const audioRef = useRef(null);

  const handleTrainingNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setButtonText('CONTINUE');
    } else {
      handleNext();
    }
  };

  const handlePlayAudio = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setAudioPlaying(true);
    } else {
      audioRef.current.pause();
      setAudioPlaying(false);
    }
  };

  useEffect(() => {
    if (audioRef.current && !audioRef.current.paused) {
      setAudioPlaying(true);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (audioRef.current && audioRef.current.paused && audioPlaying) {
      audioRef.current.play();
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
    <Container textAlign="center" style={{ padding: '40px', background: '#fff', height:'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', margin: 0 }}>
      {questions.length > 0 && currentIndex < questions.length ? (
        <div style={{ margin: '0 auto', maxWidth: '600px' }}>
          <Header as="h1" style={{ marginBottom: '30px', fontSize: '2.5em', color: '#333' }}>
            {questions[currentIndex].text}
          </Header>
          <Card centered style={{ width: '350px', height: '350px', margin: '0 auto', marginBottom: '30px', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <Transition animation="fade" duration={500} visible={true}>
              <Image src={getImageUrl(questions[currentIndex].image1)} style={{ height: '100%', objectFit: 'cover' }} />
            </Transition>
          </Card>
          <div style={{ margin: '30px 0' }}>
            <Button circular icon={audioPlaying ? 'pause' : 'play'} onClick={handlePlayAudio} primary size='large' />
            <Button circular icon='refresh' onClick={() => setAudioPlaying(false)} primary size='large' style={{ marginLeft: '15px' }} />
          </div>
          <Button size="huge" onClick={handleTrainingNext} primary style={{ padding: '15px 30px', borderRadius: '15px', backgroundColor: '#4CAF50', color: '#fff' }}>
            {buttonText}
          </Button>
          <audio id="trainingAudio" ref={audioRef} src={getAudioUrl(questions[currentIndex].audio1)} autoPlay />
        </div>
      ) : (
        <Message>No training material available.</Message>
      )}
    </Container>
  );
});

export default Training;
