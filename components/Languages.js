import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from './LanguageContext';
import StudentLanguageSelecter from './StudentLanguageSelecter';
import { Loader } from 'semantic-ui-react';

const Languages = () => {
  const navigate = useNavigate();
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext);
  const [languages, setLanguages] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(true);
  
  useEffect(() => {
    const stars = 100;
    const starfield = document.querySelector('.starfield');

    for (let i = 0; i < stars; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDuration = `${10 + Math.random() * 10}s`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      
      starfield.appendChild(star);
    }
  }, []);
  
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("/api/v1/languages");
        const data = await response.json();
        setLanguages(data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      } finally {
        setLoadingLanguages(false);
      }
    };

    fetchLanguages();
  }, []);

 const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    navigate(`/student`);
  };

  const languageCodeMap = {
    English: "us",
    Spanish: "es",
    French: "fr",
    German: "de",
    Hindi: "in",
    Italian: "it",
    Japanese: "jp",
    Mandarin: "cn",
    Sanskrit: "in",
    Malayalam: "in",
    Tamil: "in",
  };

  const styles = {
    homepage: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#235390',
      backgroundImage: 'url(/path-to-your-background-image.png)', // Add your background image URL here
      backgroundSize: 'cover',
      backgroundPosition: 'center',
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
      zIndex: 0,
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
      marginTop: '2em',
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
        <div style={{ width: '80vw', position: 'relative', height: 'auto',display:'flex',justifyContent:'center',alignItems:'center' }}>
          {
            loadingLanguages ? <Loader /> : (
              <StudentLanguageSelecter
                languages={languages}
                languageCodeMap={languageCodeMap}
                handleLanguageChange={handleLanguageChange}
              />
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Languages;
