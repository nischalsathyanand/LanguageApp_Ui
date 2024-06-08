import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Header, Container, Icon,Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import Training from "./Training";
import Assessment from "./Assessment";
import { questionSessionStore } from "../store/questionSessionStore";

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const divideQuestions = (questions, partSize) => {
  const parts = [];
  for (let i = 0; i < questions.length; i += partSize) {
    parts.push(questions.slice(i, i + partSize));
  }
  return parts;
};

const TrainingAndAssessmentContainer = observer(({ selectedLessonId, selectedChapterId,username }) => {

  const { questions, selectedLesson, score } = questionSessionStore;
  const PART_SIZE = 4;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTraining, setIsTraining] = useState(true);
  const [partIndex, setPartIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setStartTime(new Date());

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
        setShowConfetti(true);
        clearInterval(timerInterval);
        setTimeout(() => {
          navigate("/student");
        }, 4000);
      } else {
        setCurrentIndex(nextIndex);
        setIsTraining(true);
        setPartIndex(partIndex + 1);
      }
    }
  };
  const handleNextLesson = () => {
    questionSessionStore.clear();
    navigate("/student"); 
  }

  const parts = divideQuestions(questions, PART_SIZE);
  const currentPart = parts[partIndex];

  if (!selectedLesson) {
    return <div>Please select a lesson to start.</div>;
  }

  const formattedTime = `${Math.floor(timeElapsed / 60)
    .toString()
    .padStart(2, "0")}:${(timeElapsed % 60).toString().padStart(2, "0")}`;

  return (
    <Container
      style={{
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        width: "100%",
        margin: 0,
        height: "100vh",
        padding: "0px",
        margin: "0px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          height: "auto",
          width: "100%",
        }}
      >
        <div>
          <Icon name="heart" color="red" />
          <span
            style={{ marginLeft: "5px", fontWeight: "bold", fontSize: "20px" }}
          >
            Score: {score} / {questions.length}
          </span>
        </div>
        <div>
          <Icon name="clock" />
          <span
            style={{ marginLeft: "5px", fontWeight: "bold", fontSize: "20px" }}
          >
            Time: {formattedTime}
          </span>
        </div>
      </div>
      <div
        style={{
          position: "relative",
          objectFit: "cover",
          height: "auto",
          maxWidth: "100%",
          top: "30px",
          padding: "0px",
          margin: "20px",
        }}
      >
        {showConfetti ? (
          <div style={{ textAlign: "center" }}>
            <Header as="h2" style={{ color: "#21ba45", marginBottom: "20px" }}>
              Congratulations! You have completed all parts.
            </Header>
            <p>Completed Time: {formattedTime}</p>
            <p>
              Score: {score} / {questions.length}
            </p>
            <Confetti />
            <Button primary onClick={handleNextLesson}>Next Lesson</Button>
          </div>
        ) : (
          currentPart && (
            <>
              {isTraining ? (
                <Training questions={currentPart} handleNext={handleNext} />
              ) : (
                <Assessment
                  questions={currentPart}
                  handleNext={handleNext}
                  isLastPart={partIndex === parts.length - 1}
                  selectedLessonId={selectedLessonId}
                  selectedChapterId={selectedChapterId}
                  username={username}
                />
              )}
            </>
          )
        )}
      </div>
    </Container>
  );
});

export default TrainingAndAssessmentContainer;
