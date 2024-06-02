import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

const FeedbackComponent = ({ message, onNext }) => {
  const isCorrect = message === 'Correct answer!';
  return (
    <div style={{
      padding: '20px',
      borderRadius: '10px',
      backgroundColor: isCorrect ? '#dff0d8' : '#f2dede',
      color: isCorrect ? '#3c763d' : '#a94442',
      marginTop: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Icon name={isCorrect ? 'check circle' : 'times circle'} size="big" />
      <div style={{ fontSize: '1.2em', marginBottom: '10px' }}>{message}</div>
      <Button onClick={onNext} primary>
        Next
      </Button>
    </div>
  );
};

export default FeedbackComponent;
