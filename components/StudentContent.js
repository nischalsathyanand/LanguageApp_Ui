import React, { useEffect, useState } from 'react';
import { Container, Header, Loader, Icon, Popup, Modal, Message } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { questionSessionStore } from '../store/questionSessionStore';
import TrainingAndAssessmentContainer from './TrainingAndAssessmentContainer';
import 'semantic-ui-css/semantic.min.css';

const colorPalette = {
  0: "#CE82FF",
  1: "#00CD9C",
  2: "#58CC02",
};

const getColorForChapter = (index) => colorPalette[index % Object.keys(colorPalette).length];

const StudentContent = observer(({ selectedLanguage }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChapterName, setSelectedChapterName] = useState('');
  const [completedLessons, setCompletedLessons] = useState([]);
  const [lessonCompleted, setLessonCompleted] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [username, setUsername] = useState("Default Username");
  const [name, setName] = useState("Default Username");

  const fetchCompletedLessons = async () => {
    try {
      const storedUsername = sessionStorage.getItem('username');
      const studentName = sessionStorage.getItem('name');

      if (storedUsername) {
        setUsername(storedUsername);
      }
      if (studentName) {
        setName(studentName);
      }

      const response = await fetch(`http://localhost:3000/user/${storedUsername}/completedChapters`);
      if (!response.ok) throw new Error('Failed to fetch completed lessons');
      const data = await response.json();
      setCompletedLessons(data);
    } catch (error) {
      console.error('Error fetching completed lessons:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchCompletedLessons();
  }, [username, lessonCompleted]);

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

  const handleLessonClick = (lesson, chapterId, chapterName) => {
    const isCompleted = completedLessons.some(chapter => 
      chapter.chapter_id === chapterId && chapter.completedLessons.some(l => l.lesson_id === lesson._id)
    );

    if (isCompleted) {
      setToastMessage('Lesson already completed');
      setTimeout(() => setToastMessage(''), 3000);
    } else {
      setSelectedLesson({ ...lesson, chapterId });
      setSelectedChapterName(chapterName);
      setPopupOpen(true);
    }
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

  const renderLessonIcons = (lessonId, chapterId) => {
    let isCompleted = false;
    let isNext = false;

    completedLessons.forEach(chapter => {
      if (chapter.chapter_id === chapterId) {
        isCompleted = chapter.completedLessons.some(lesson => lesson.lesson_id === lessonId);
      }
    });

    // Determine if the lesson is the next accessible one
    const chapterIndex = chapters.findIndex(chapter => chapter._id === chapterId);
    const lessonIndex = chapters[chapterIndex].lessons.findIndex(lesson => lesson._id === lessonId);

    if (chapterIndex === 0 && lessonIndex === 0) {
      isNext = true;
    } else if (chapterIndex !== -1 && lessonIndex !== -1) {
      if (lessonIndex > 0) {
        const prevLesson = chapters[chapterIndex].lessons[lessonIndex - 1];
        isNext = completedLessons.some(chapter => 
          chapter.chapter_id === chapterId && chapter.completedLessons.some(l => l.lesson_id === prevLesson._id)
        );
      } else {
        const prevChapter = chapters[chapterIndex - 1];
        isNext = completedLessons.some(chapter => 
          chapter.chapter_id === prevChapter._id && chapter.completedLessons.length === prevChapter.lessons.length
        );
      }
    }

    // if (isCompleted) {
    //   return <Icon name='check large' style={{ color: 'gray' }} />;
    // } 
    // else if (isNext) {
    //   return <Icon name='star large' style={{ color: 'white' }} />;
    // } 
    // else if(isAccessible && !isCompleted ){
    //   return <Icon name='star large' style={{ color: 'white' }} />;
    // }
    // else {
    //   return <Icon name='lock large' style={{ color: 'gray' }} />;
    // }
  };

  const renderLessons = (lessons, chapterId, chapterName, color) => {
    if (!lessons || lessons.length === 0) {
      return <p style={{ color: '#999' }}>No lessons found for this chapter.</p>;
    }

    const centerX = 150;
    const startY = 50;
    const yStep = 110;
    const xCurve = 60;
    const containerHeight = startY + (lessons.length - 1) * yStep + 100;

    return (
      <div className="lessons-container-outer" style={{ width: '300px', margin: 'auto', zIndex: '1' }}>
        <div className="lessons-container-inner" style={{ position: 'relative', height: `${containerHeight}px` }}>
          {lessons.map((lesson, index) => {
            const buttonY = startY + index * yStep;
            const buttonX = centerX + Math.sin(index * 1) * xCurve;

            const isCompleted = completedLessons.some(chapter => 
              chapter.chapter_id === chapterId && chapter.completedLessons.some(l => l.lesson_id === lesson._id)
            );

            const isNext = index === 0 || (index > 0 && completedLessons.some(chapter => 
              chapter.chapter_id === chapterId && chapter.completedLessons.some(l => l.lesson_id === lessons[index - 1]._id)
            ));

            const isAccessible = isCompleted || isNext;

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
                    zIndex: 1000,
                  }}>
                    <div style={{
                      color: 'white',
                      fontSize: '1.5em',
                      fontWeight: 'bold',
                      marginBottom: '1em'
                    }}>
                      {lesson.name}
                    </div>
                    {isAccessible && (
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
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                          transition: 'box-shadow 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4)'}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'}
                        onClick={handleStartClick}
                      >
                        Start
                      </button>
                    )}
                  </div>
                )}
                trigger={
                  <button
                    className={`lesson-button lesson-button-${index}`}
                    style={{
                      backgroundColor: isAccessible && !isCompleted ? color : (isCompleted ? '#FACC15' : '#D3D3D3'),
                      width: '70px',
                      height: '70px',
                      border: 'none',
                      boxShadow: '0 4px 8px rgba(55, 70, 0, 2)',
                      borderRadius: '50%',
                      position: 'absolute',
                      cursor: isAccessible ? 'pointer' : 'not-allowed',
                      left: `${buttonX}px`,
                      top: `${buttonY}px`,
                    }}
                    onClick={() => isAccessible && handleLessonClick(lesson, chapterId, chapterName)}
                  >
                    {isAccessible && !isCompleted ?

                    (
                      <Icon name='star large' style={{ color: 'white' }} />
                    ) :
                    !isAccessible && !isCompleted ?

                    (
                      <Icon name='lock large' style={{ color: 'gray' }} />
                    ) :
                     (
                      <Icon name='check large' style={{ color: 'gray' }} />
                     )

                    }
                    {renderLessonIcons(lesson._id, chapterId)}
                  </button>
                }
              />
            );
          })}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setPopupOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleModalClose = () =>{
    questionSessionStore.clear();
   setModalOpen(false);
  }


  return (
    <Container style={{ marginTop: '0em', padding: '2em', backgroundColor: '#ffff', margin: '0px', position: 'relative', height: 'auto' }}>
      {loading ? (
        <Loader active inline='centered' />
      ) : error ? (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
      ) : (
        <div style={{ margin: '0px', padding: '0px' }}>
          {chapters.map((chapter, index) => (
            <div key={chapter._id} style={{ marginBottom: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div
                as='h2'
                style={{
                  backgroundColor: getColorForChapter(index),
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: '0em',
                  padding: '0.5em',
                  width: '60%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minHeight: '90px',
                  borderRadius: '15px',
                  fontSize: '20px',
                  fontFamily: 'timesNewRoman',
                  fontWeight: '600'
                }}
              >
                {chapter.name}
              </div>
              
              {renderLessons(chapter.lessons, chapter._id, chapter.name, getColorForChapter(index))}
            </div>
          ))}

          {toastMessage && (
            <Message positive>
              <Message.Header>Notification</Message.Header>
              <p>{toastMessage}</p>
            </Message>
          )}

          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100vh',
              margin: '0px',
              padding: '0px',
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Modal.Header style={{ display: 'flex', position: 'relative', maxHeight: '7vh' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', maxHeight: '7vh' }}>
                <Icon
                  size='large'
                  name='close'
                  style={{ cursor: 'pointer' }}
                  onClick={handleModalClose}
                />
              </div>
            </Modal.Header>
            <Modal.Content style={{ display: 'flex', position: 'relative', maxHeight: '93vh', minHeight: '93vh' }}>
              <TrainingAndAssessmentContainer
                questionSessionStore={questionSessionStore}
                selectedLessonId={selectedLesson?._id}
                selectedChapterId={selectedLesson?.chapterId}
                selectedChapterName={selectedChapterName}
                selectedLessonName={selectedLesson?.name}
                username={username}
                setModalOpen={setModalOpen}
                onLessonComplete={() => setLessonCompleted(!lessonCompleted)}
              />
            </Modal.Content>
          </Modal>
        </div>
      )}
    </Container>
  );
});

export default StudentContent;
