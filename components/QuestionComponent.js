import React, { useState, useEffect } from 'react';
import { Form, Button } from 'semantic-ui-react';

const QuestionComponent = () => {
  const [timeElapsed, setTimeElapsed] = useState(0); // Time elapsed in seconds
  const [score, setScore] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeElapsed((prevTimeElapsed) => prevTimeElapsed + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);


  return (
    <div style={{ padding: '1em', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em' }}>
        <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>Score: {score}</div>
        <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>Time: {timeElapsed}s</div>
      </div>
      <h1>Questions</h1>
      
    </div>
  );
};

export default QuestionComponent;
