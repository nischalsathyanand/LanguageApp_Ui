import React, { useEffect, useState } from 'react';
import { Container, Header, Button, Loader, Icon, Popup, Modal } from 'semantic-ui-react';
import QuestionComponent from './QuestionComponent'; // Adjust the import path as necessary

const StudentContent = ({ selectedLanguage }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!selectedLanguage) return;

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/v1/languages/${selectedLanguage._id}/chapters`);
        const data = await response.json();
        
        // Fetch lessons for each chapter
        const chaptersWithLessons = await Promise.all(data.map(async (chapter) => {
          const lessonsResponse = await fetch(`http://localhost:3000/api/v1/languages/${selectedLanguage._id}/chapters/${chapter._id}/lessons`);
          const lessons = await lessonsResponse.json();
          return { ...chapter, lessons };
        }));

        setChapters(chaptersWithLessons);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [selectedLanguage]);

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    setPopupOpen(true);
  };

  const handleStartClick = () => {
    setPopupOpen(false);
    setModalOpen(true);
  };

  const renderLessons = (lessons) => {
    if (!lessons || lessons.length === 0) {
      return <p>No lessons found for this chapter.</p>;
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
              <div style={{ backgroundColor: '#58CC02', padding: '2em', borderRadius: '10px', textAlign: 'center', width: '300px' }}>
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
                color='orange' 
                style={{ margin: '0.5em', width: '60px', height: '60px', backgroundColor: 'transparent', border: 'none' }}
                onClick={() => handleLessonClick(lesson)}
              >
                <Icon name='star' />
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
      ) : (
        <div style={{ position: 'sticky', top: '5em', zIndex: 10 }}>
          {chapters.map((chapter) => (
            <div key={chapter._id} style={{ marginBottom: '2em' }}>
              <Header as='h2' style={{ backgroundColor: '#CE82FF', color: 'white', margin: '0', padding: '1em' }}>
                {chapter.name}
              </Header>
              {renderLessons(chapter.lessons)}
            </div>
          ))}
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
          </div>
        </Modal.Header>
        <Modal.Content>
          <QuestionComponent />
        </Modal.Content>
      </Modal>
    </Container>
  );
};

export default StudentContent;
