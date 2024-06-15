import React, { useEffect, useState } from 'react';
import { Container, Header, Loader, Icon, Popup, Modal, Message } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { questionSessionStore } from '../store/questionSessionStore';
import TrainingAndAssessmentContainer from './TrainingAndAssessmentContainer';
import 'semantic-ui-css/semantic.min.css';

const colorPalette = {
  0: "#1CB0F6",
  1: "#00CD9C",
  2: "#FF4B4B",
  3: "#FF9600",
  4: "#FF86D0",
  5: "#CE82FF"
};

const getColorForChapter = (index) => colorPalette[index % Object.keys(colorPalette).length];

const StudentContent = observer(({ selectedLanguage, username }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!selectedLanguage) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/api/v1/languages/${selectedLanguage._id}/chapters`);
        if (!response.ok) throw new Error('Failed to fetch chapters');
        const data = await response.json();

        const chaptersWithLessons = await Promise.all(data.map(async (chapter) => {
          const lessonsResponse = await fetch(`http://localhost:3000/api/v1/languages/${selectedLanguage._id}/chapters/${chapter._id}/lessons`);
          if (!lessonsResponse.ok) throw new Error('Failed to fetch lessons');
          const lessons = await lessonsResponse.json();
          return { ...chapter, lessons };
        }));

        setChapters(chaptersWithLessons);
      } catch (error) {
        console.error('Error fetching chapters:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [selectedLanguage]);

  const handleLessonClick = (lesson, chapterId) => {
    setSelectedLesson({ ...lesson, chapterId });
    setPopupOpen(true);
  };

  const handleStartClick = async () => {
    if (selectedLesson) {
      setLoading(true);
      setPopupOpen(false);
      try {
        const response = await fetch(`http://localhost:3000/api/v1/languages/${selectedLanguage._id}/chapters/${selectedLesson.chapterId}/lessons/${selectedLesson._id}/questions`);
        if (!response.ok) throw new Error('Failed to fetch questions');
        const questions = await response.json();
        questionSessionStore.setQuestions(questions);
        questionSessionStore.setSelectedLesson(selectedLesson);
        setModalOpen(true);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderLessons = (lessons, chapterId, color) => {
    if (!lessons || lessons.length === 0) {
      return <p style={{ color: '#999' }}>No lessons found for this chapter.</p>;
    }

    const centerX = 150; // Center X for the curved path
    const startY = 50; // Start Y position for the first button
    const yStep = 90; // Vertical distance between buttons
    const xCurve = 60; // Increase the horizontal curvature factor
    const containerHeight = startY + (lessons.length - 1) * yStep + 100; // Dynamically calculate the container height

    return (
      <div className="lessons-container-outer" style={{ width: '300px', margin: 'auto', zIndex: '1' }}>
        <div className="lessons-container-inner" style={{ position: 'relative', height: `${containerHeight}px` }}>
          {lessons.map((lesson, index) => {
            const buttonY = startY + index * yStep;
            const buttonX = centerX + Math.sin(index * 1) * xCurve; // Increase the frequency of the sine function

            return (
              <Popup
                key={lesson._id}
                open={popupOpen && selectedLesson?._id === lesson._id}
                onClose={() => setPopupOpen(false)}
                closeOnTriggerMouseLeave={false}
                position='bottom center'
                content={(
                  <div style={{
                    backgroundColor: color,
                    padding: '2em',
                    borderRadius: '10px',
                    textAlign: 'center',
                    width: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000, // Add z-index to ensure the popup is above other elements
                  }}>
                    <div style={{
                      color: 'white',
                      fontSize: '1.5em',
                      fontWeight: 'bold',
                      marginBottom: '1em'
                    }}>
                      {lesson.name}
                    </div>
                    <button
                      style={{
                        padding: '0.8em 2em',
                        fontSize: '1em',
                        backgroundColor: 'white',
                        color: color,
                        width: '70%',
                        height: '40%',
                        borderRadius: '15px',
                        border: 'none',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Default box shadow
                        transition: 'box-shadow 0.3s ease', // Transition for smooth animation
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4)'} // Hover box shadow
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'} // Revert to default on leave
                      onClick={handleStartClick}
                    >
                      Start
                    </button>
                  </div>
                )}
                trigger={
                  <button
                    className={`lesson-button lesson-button-${index}`}
                    style={{
                      backgroundColor: '#d6d327',
                      width: '70px',
                      height: '70px',
                      border: 'none',
                      boxShadow: '0 4px 8px rgba(55, 70, 0, 2)',
                      borderRadius: '50%',
                      position: 'absolute',
                      cursor: 'pointer',
                      left: `${buttonX}px`,
                      top: `${buttonY}px`,
                    }}
                    onClick={() => handleLessonClick(lesson, chapterId)}
                  >
                    <Icon name='check large' style={{ color: 'white' }} />
                  </button>
                }
              />
            );
          })}
        </div>
      </div>
    );
  };

  // Add scroll event listener and clean up on unmount
  useEffect(() => {
    const handleScroll = () => {
      setPopupOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Container style={{ marginTop: '0em', padding: '2em' }}>
      {loading ? (
        <Loader active inline='centered' />
      ) : error ? (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
      ) : (
        <div>
          {chapters.map((chapter, index) => (
            <div key={chapter._id} style={{ marginBottom: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div
                as='h2'
                style={{
                  backgroundColor: getColorForChapter(index), // Random color for each chapter
                  color: 'white', // White text color for contrast
                  textAlign: 'center',
                  marginBottom: '0em',
                  padding: '0.5em',
                  width: '70%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minHeight: '80px',
                  borderRadius: '15px',
                  fontSize: '20px',
                  fontFamily: 'timesNewRoman',
                  fontWeight: '600'
                }}
              >
                {chapter.name}
              </div>
              {renderLessons(chapter.lessons, chapter._id, getColorForChapter(index))}
            </div>
          ))}

          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: 'auto',
              margin: 0,
              backgroundColor: 'white',
            }}
          >
            <Modal.Header>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Icon
                  size='large'
                  name='close'
                  style={{ cursor: 'pointer' }}
                  onClick={() => setModalOpen(false)}
                />

                <div></div>
              </div>
            </Modal.Header>
            <Modal.Content>
              <TrainingAndAssessmentContainer
                questionSessionStore={questionSessionStore}
                selectedLessonId={selectedLesson?._id}
                selectedChapterId={selectedLesson?.chapterId}
                username={username}
                setModalOpen={setModalOpen}
              />

            </Modal.Content>
          </Modal>
        </div>
      )}
    </Container>
  );
});

export default StudentContent;

