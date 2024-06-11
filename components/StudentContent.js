import React, { useEffect, useState, useRef } from 'react';
import { Container, Header, Button, Loader, Icon, Popup, Modal, Sticky, Message } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { questionSessionStore } from '../store/questionSessionStore'; // Import the MobX store
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

const StudentContent = observer(({ selectedLanguage,username }) => {
  
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const contextRef = useRef();
  const headersRef = useRef([]);
  const stickyHeaderRef = useRef(null);

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + (stickyHeaderRef.current?.offsetHeight || 0) + 20; // Added 20px offset for extra spacing
      for (let i = 0; i < headersRef.current.length; i++) {
        const headerTop = headersRef.current[i]?.getBoundingClientRect().top + window.scrollY - (stickyHeaderRef.current?.offsetHeight || 0);
        const headerBottom = headersRef.current[i + 1]?.getBoundingClientRect().top + window.scrollY - (stickyHeaderRef.current?.offsetHeight || 0) || Number.POSITIVE_INFINITY;
        if (scrollPosition >= headerTop && scrollPosition < headerBottom) {
          setActiveChapter(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1em' }}>
        {lessons.map((lesson) => (
          <Popup
            key={lesson._id}
            open={popupOpen && selectedLesson?._id === lesson._id}
            onClose={() => setPopupOpen(false)}
            closeOnTriggerMouseLeave={false}
            position='bottom center'
            content={(
              <div style={{ backgroundColor: color, padding: '2em', borderRadius: '10px', textAlign: 'center', width: '300px' }}>
                <div style={{ color: 'white', fontSize: '1.5em', fontWeight: 'bold', marginBottom: '1em' }}>
                  {lesson.name}
                </div>
                <Button 
                  color='green' 
                  onClick={handleStartClick} 
                  style={{ padding: '0.8em 2em', fontSize: '1em', backgroundColor: 'white', color: '#21ba45' }}
                >
                  Start
                </Button>
              </div>
            )}
            trigger={
              <Button 
                circular 
                style={{ margin: '0.5em', width: '60px', height: '60px', backgroundColor: color, border: 'none', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
                onClick={() => handleLessonClick(lesson, chapterId)}
              >
                <Icon name='star' style={{ color: 'white' }} />
              </Button>
            }
          />
        ))}
      </div>
    );
  };

  return (
    <Container style={{ marginTop: '2em', padding: '2em' }}>
      {loading ? (
        <Loader active inline='centered' />
      ) : error ? (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
      ) : (
        <div ref={contextRef}>
          <Sticky context={contextRef} offset={100}>
            <div
              ref={stickyHeaderRef}
              style={{
                backgroundColor: getColorForChapter(activeChapter),
                padding: '1em',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2em', // Adjusted for more space below the header
                zIndex: 1000, // Ensure the sticky header stays on top
              }}
            >
              <Icon name='arrow left' style={{ color: 'white', cursor: 'pointer' }} />
              <Header
                as='h1'
                style={{ color: 'white', margin: '0', textAlign: 'center', padding: '0.5em 0' }}
              >
                {chapters[activeChapter]?.name}
              </Header>
              <Icon name='ellipsis vertical' style={{ color: 'white' }} />
            </div>
          </Sticky>
          {chapters.map((chapter, index) => {
            const chapterColor = getColorForChapter(index);
            return (
              <div
                key={chapter._id}
                ref={(el) => (headersRef.current[index] = el)}
                style={{ marginBottom: '3em' }} // Increased marginBottom between chapters for better spacing
              >
                {index === 0 ? null : (
                  <div
                    style={{
                      height: '2px',
                      backgroundColor: chapterColor,
                      marginBottom: '2em', // Adjusted marginBottom for more space
                      marginTop: '2em'    // Added marginTop for gap
                    }}
                  ></div>
                )}
                {renderLessons(chapter.lessons, chapter._id, chapterColor)}
              </div>
            );
          })}
        </div>
      )}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
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
    </Container>
  );
});

export default StudentContent;
