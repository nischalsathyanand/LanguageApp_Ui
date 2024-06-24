import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  
  const handleGetStart = () => {
    navigate('/login');
  };

  useEffect(() => {
    const stars = 100;
    const starfield = document.querySelector('.starfield');

    for (let i = 0; i < stars; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDuration = `${10 + Math.random() * 10}s`;  // Faster movement
      star.style.animationDelay = `${Math.random() * 5}s`;  // Start at different times
      
      starfield.appendChild(star);
    }
  }, []);

  const styles = {
    homepage: {
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#1a73e8',
      color: 'white',
      textAlign: 'center',
    },
    starfield: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    },
    star: {
      position: 'absolute',
      width: '2px',
      height: '2px',
      backgroundColor: 'white',
      borderRadius: '50%',
      animationName: 'starMove',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
    },
    header: {
      fontSize: '2.5em',
      fontWeight: 'bold',
      marginBottom: '2em',
      zIndex: 1,
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 1,
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
      borderRadius: '0px',
      transition: 'background-color 0.3s',
    },
    getStartedButtonHover: {
      backgroundColor: '#2c8e41',
    },
  };

  return (
    <div style={styles.homepage}>
      <style>
        {`
          @keyframes starMove {
            from {
              transform: translate(-50px, -50px) scale(1);
            }
            to {
              transform: translate(50px, 50px) scale(1.5);
            }
          }
          .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background-color: white;
            border-radius: 50%;
            animation-name: starMove;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
        `}
      </style>
      <div className="starfield" style={styles.starfield}></div>
      <div style={styles.header}>Lantoon</div>
      <div style={styles.content}>
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

export default HomePage;