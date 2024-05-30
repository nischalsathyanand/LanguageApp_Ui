import React, { useState, useEffect } from "react";
import { Container, Header, Button, Icon, Segment } from 'semantic-ui-react';

const Assessment = ({ questions, handleNext }) => {
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(true); // Set initial state to true for auto-play

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
        setGeneratedQuestions(data);
      } catch (error) {
        console.error('Error fetching generated questions:', error);
      }
    };

    fetchGeneratedQuestions();
  }, [questions]);

  useEffect(() => {
    const audioElement = document.getElementById(`assessmentAudio${currentIndex}`);
    if (audioElement) {
      audioElement.play().then(() => {
        setAudioPlaying(true);
      }).catch(() => {
        setAudioPlaying(false);
      });
    }

    return () => {
      if (audioElement) {
        audioElement.pause();
        setAudioPlaying(false);
      }
    };
  }, [currentIndex]);

  const handleAssessmentNext = () => {
    if (currentIndex < generatedQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleNext();
    }
  };

  const handlePlayAudio = () => {
    const audioElement = document.getElementById(`assessmentAudio${currentIndex}`);
    if (audioElement.paused) {
      audioElement.play();
      setAudioPlaying(true);
    } else {
      audioElement.pause();
      setAudioPlaying(false);
    }
  };

  const getAudioUrl = (audioPath) => {
    if (!audioPath) return '';
    const fileName = audioPath.split('/').slice(-2, -1)[0] + '.mp3';
    return `http://localhost:3000/aws/data/${audioPath}${fileName}`;
  };

  return (
    <Container textAlign="center" style={{ padding: '20px', background: '#f7f7f7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {generatedQuestions.length > 0 && currentIndex < generatedQuestions.length ? (
        <Segment raised style={{ padding: '40px', borderRadius: '10px', width: '100%', maxWidth: '600px', textAlign: 'center', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
          <Header as="h1" style={{ marginBottom: '30px', fontSize: '2em', color: '#333' }}>
            {generatedQuestions[currentIndex].text}
          </Header>
          <Icon 
            name={audioPlaying ? 'pause circle' : 'play circle'} 
            size='huge' 
            style={{ marginBottom: '30px', cursor: 'pointer', color: '#21ba45' }} 
            onClick={handlePlayAudio} 
          />
          <Button 
            size="huge" 
            onClick={handleAssessmentNext} 
            primary 
            style={{ padding: '15px 30px', backgroundColor: '#21ba45', borderRadius: '50px', fontSize: '1.2em' }}
          >
            Next
          </Button>
          <audio id={`assessmentAudio${currentIndex}`} src={getAudioUrl(generatedQuestions[currentIndex].audio1)} />
        </Segment>
      ) : (
        <Segment raised style={{ padding: '40px', borderRadius: '10px', width: '100%', maxWidth: '600px', textAlign: 'center', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
          <Header as="h2" style={{ marginBottom: '30px', fontSize: '1.5em', color: '#333' }}>
            No assessment material available.
          </Header>
        </Segment>
      )}
    </Container>
  );
};

export default Assessment;
