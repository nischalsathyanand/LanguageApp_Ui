import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Header, Container, Button, Icon } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import Training from './Training';
import Assessment from './Assessment';
import { questionSessionStore } from '../store/questionSessionStore'; // Import the MobX store

const TrainingAndAssessmentContainer = observer(() => {
  const { questions, selectedLesson } = questionSessionStore;
  const PART_SIZE = 4;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTraining, setIsTraining] = useState(true);
  const [partIndex, setPartIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0); // Total elapsed time in seconds
  const [timerInterval, setTimerInterval] = useState(null); // Interval ID for the timer
  const [score, setScore] = useState(0); // Score tracker

  const navigate = useNavigate();

  // Start the timer when the lesson starts
  useEffect(() => {
    setStartTime(new Date());

    // Update the elapsed time every second
    const intervalId = setInterval(() => {
      setTimeElapsed((prevTimeElapsed) => prevTimeElapsed + 1);
    }, 1000);

    setTimerInterval(intervalId);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleNext = () => {
    if (isTraining) {
      setIsTraining(false);
    } else {
      const nextIndex = currentIndex + PART_SIZE;
      if (nextIndex >= questions.length) {
        setEndTime(new Date());
        setPartIndex(partIndex + 1);
      } else {
        setCurrentIndex(nextIndex);
        setIsTraining(true);
      }
    }
  };

  useEffect(() => {
    if (partIndex * PART_SIZE >= questions.length) {
      clearInterval(timerInterval); // Stop the timer
      setTimeout(() => {
        navigate('/home');
      }, 4000);
    }
  }, [partIndex, questions.length, navigate, timerInterval]);

  const currentPart = questions.slice(currentIndex, currentIndex + PART_SIZE);

  // Calculate the score based on completed assessments
  const calculateScore = () => {
    let totalScore = 0;
    for (let i = 0; i < partIndex; i++) {
      totalScore += PART_SIZE;
    }
    totalScore += currentIndex;
    return totalScore;
  };

  if (!selectedLesson) {
    return <div>Please select a lesson to start.</div>;
  }

  return (
    <Container style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <Icon name='heart' color='red' />
          <span style={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '20px' }}>Score: {score} / {questions.length}</span>
        </div>
        <div>
          <Icon name='clock' />
          <span style={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '20px' }}>Time: {timeElapsed} seconds</span>
        </div>
      </div>
      {partIndex * PART_SIZE < questions.length ? (
        isTraining ? (
          <Training questions={currentPart} handleNext={handleNext} />
        ) : (
          <Assessment
            questions={currentPart}
            handleNext={handleNext}
            onAssessmentComplete={() => {
              setScore(calculateScore());
              handleNext();
            }}
          />
        )
      ) : (
        <div style={{ textAlign: 'center' }}>
          <Header as="h2" style={{ color: '#21ba45', marginBottom: '20px' }}>Congratulations! You have completed all parts.</Header>
          <p>Completed Time: {timeElapsed} seconds</p>
          <p>Score: {score} / {questions.length}</p>
          <Confetti />
        </div>
      )}
    </Container>
  );
});

export default TrainingAndAssessmentContainer;
