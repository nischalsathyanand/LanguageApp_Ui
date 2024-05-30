import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Header, Progress, Container, Button, Icon } from 'semantic-ui-react';
import { useNavigate } from "react-router-dom";
import Confetti from 'react-confetti';
import Training from './Training';
import Assessment from './Assessment';
import { questionSessionStore } from '../store/questionSessionStore'; // Import the MobX store

const TrainingAndAssessmentContainer = observer(() => {
  const { selectedLesson } = questionSessionStore;
  const PART_SIZE = 4;
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTraining, setIsTraining] = useState(true);
  const [progressPercent, setProgressPercent] = useState(0);
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:3000/v1/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ questions: questionSessionStore.questions })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }

        const data = await response.json();
      
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    setProgressPercent((currentIndex / questions.length) * 100);
  }, [currentIndex, questions.length]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const handleNext = () => {
    setIsTraining(!isTraining);
    if (!isTraining) {
      if (currentIndex + PART_SIZE < questions.length) {
        setCurrentIndex(currentIndex + PART_SIZE);
        setProgressPercent(((currentIndex + PART_SIZE) / questions.length) * 100);
      } else {
        setCurrentIndex(0);
        setProgressPercent(100);
      }
    }
  };

  useEffect(() => {
    if (progressPercent === 100) {
      setTimeout(() => {
        navigate("/home");
      }, 4000);
    }
  }, [progressPercent, navigate]);

  const currentPart = questions.slice(currentIndex, currentIndex + PART_SIZE);

  if (!selectedLesson) {
    return <div>Please select a lesson to start.</div>;
  }

  return (
    <Container style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <Icon name='heart' color='red' />
          <span style={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '20px' }}>Score: {currentIndex} / {questions.length}</span>
        </div>
        <div>
          <Icon name='clock' />
          <span style={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '20px' }}>Time: {timer} seconds</span>
        </div>
      </div>
      <Progress percent={progressPercent} color='teal' style={{ marginBottom: '20px' }} />
      {progressPercent < 100 ? (
        isTraining ? (
          <Training questions={currentPart} handleNext={handleNext} />
        ) : (
          <Assessment questions={currentPart} handleNext={handleNext} />
        )
      ) : (
        <div style={{ textAlign: 'center' }}>
          <Header as="h2" style={{ color: '#21ba45', marginBottom: '20px' }}>Congratulations! You have completed all parts.</Header>
          <Confetti />
        </div>
      )}
    </Container>
  );
});

export default TrainingAndAssessmentContainer;
