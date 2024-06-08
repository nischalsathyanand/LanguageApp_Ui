import React from 'react';

import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  
  const handleGetStart = () => {
    navigate('/login');
  };

  const styles = {
    homepage: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#1a73e8',
  
      color: 'white',
      textAlign: 'center',
    },
    header: {
      fontSize: '2.5em',
      fontWeight: 'bold',
      marginBottom: '2em',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    
    tagline: {
      fontSize: '1.5em',
      marginBottom: '1em',
    },
    getStartedButton: {
      backgroundColor: '#34a853',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      fontSize: '1.2em',
      cursor: 'pointer',
      borderRadius: '5px',
      transition: 'background-color 0.3s',
    },
    getStartedButtonHover: {
      backgroundColor: '#2c8e41',
    },
  };

  return (
    <div style={styles.homepage}>
      <div style={styles.header}>Lantoon</div>
      <div style={styles.content}>
        <div style={styles.earth}></div>
        <div style={styles.tagline}>Learn a new language the way you learn best</div>
        <button
          style={styles.getStartedButton}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.getStartedButtonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.getStartedButton.backgroundColor)}
          onClick={handleGetStart}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HomePage;
