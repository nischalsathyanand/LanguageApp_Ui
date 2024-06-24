import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown, Container, Header, Segment, Divider, Modal, Message, Loader, Icon, Step, Grid } from 'semantic-ui-react';

const AddCourse = ({ setActiveStep }) => {
  const [languageName, setLanguageName] = useState('');
  const [languages, setLanguages] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [chapterName, setChapterName] = useState('');
  const [lessonName, setLessonName] = useState('');
  const [text, setText] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [audio1, setAudio1] = useState('');
  const [audio2, setAudio2] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ content: '', type: '' });
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/languages');
      const data = await response.json();
      setLanguages(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching languages:', error);
    }
  };

  const handleLanguageChange = (event, { value }) => {
    setSelectedLanguage(value);
    fetchChapters(value);
  };

  const handleChapterChange = (event, { value }) => {
    setSelectedChapter(value);
    fetchLessons(selectedLanguage, value);
  };

  const fetchChapters = async (languageId) => {
    try {
      const response = await fetch(`/api/v1/languages/${languageId}/chapters`);
      const data = await response.json();
      setChapters(data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const fetchLessons = async (languageId, chapterId) => {
    try {
      const response = await fetch(`/api/v1/languages/${languageId}/chapters/${chapterId}/lessons`);
      const data = await response.json();
      setLessons(data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const handleLanguageSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/v1/languages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: languageName }),
      });
      const data = await response.json();
      setLanguages([...languages, data]);
      setLanguageName('');
      setMessage({ content: 'Language added successfully!', type: 'success' });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage({ content: 'Error adding language.', type: 'error' });
      console.error('Error creating language:', error);
    }
  };

  const handleChapterSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/languages/${selectedLanguage}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: chapterName }),
      });
      const data = await response.json();
      setChapters([...chapters, data]);
      setChapterName('');
      setMessage({ content: 'Chapter added successfully!', type: 'success' });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage({ content: 'Error adding chapter.', type: 'error' });
      console.error('Error creating chapter:', error);
    }
  };

  const handleLessonSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/languages/${selectedLanguage}/chapters/${selectedChapter}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: lessonName }),
      });
      const data = await response.json();
      setLessons([...lessons, data]);
      setLessonName('');
      setMessage({ content: 'Lesson added successfully!', type: 'success' });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage({ content: 'Error adding lesson.', type: 'error' });
      console.error('Error creating lesson:', error);
    }
  };

  const handleQuestionSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/languages/${selectedLanguage}/chapters/${selectedChapter}/lessons/${selectedLesson}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question_type: questionType,
          text,
          image1,
          image2,
          audio1,
          audio2,
          answerText,
        }),
      });
      const data = await response.json();
      setQuestions([...questions, data]);
      setQuestionType('');
      setText('');
      setImage1('');
      setImage2('');
      setAudio1('');
      setAudio2('');
      setAnswerText('');
      setModalOpen(false);
      setMessage({ content: 'Question added successfully!', type: 'success' });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage({ content: 'Error adding question.', type: 'error' });
      console.error('Error creating question:', error);
    }
  };

  const languageOptions = languages.map(language => ({
    key: language._id,
    text: language.name,
    value: language._id
  }));

  const chapterOptions = chapters.map(chapter => ({
    key: chapter._id,
    text: chapter.name,
    value: chapter._id
  }));

  const lessonOptions = lessons.map(lesson => ({
    key: lesson._id,
    text: lesson.name,
    value: lesson._id
  }));

  const steps = [
    { key: 'language', icon: 'language', title: 'Add Language' },
    { key: 'chapter', icon: 'book', title: 'Add Chapter' },
    { key: 'lesson', icon: 'student', title: 'Add Lesson' },
    { key: 'question', icon: 'question circle', title: 'Add Questions' }
  ];

  return (
    <Container className="container" style={{ marginTop: '20px' }}>
      <Header as="h2" textAlign="center" style={{ marginBottom: '20px' }}>Add New Course</Header>

      {message.content && (
        <Message
          success={message.type === 'success'}
          error={message.type === 'error'}
          content={message.content}
        />
      )}

      {loading && <Loader active inline='centered' />}

      <Step.Group ordered fluid size="mini">
        {steps.map((step, index) => (
          <Step
            key={step.key}
            active={currentStep === index + 1}
            completed={currentStep > index + 1}
            onClick={() => setCurrentStep(index + 1)}
          >
            <Icon name={step.icon} />
            <Step.Content>
              <Step.Title>{step.title}</Step.Title>
            </Step.Content>
          </Step>
        ))}
      </Step.Group>

      <Segment raised>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={16}>
              {currentStep === 1 && (
                <>
                  <Header as="h3" icon>
                    <Icon name="language" />
                    Add Language
                  </Header>
                  <Form onSubmit={handleLanguageSubmit}>
                    <Form.Input
                      placeholder="Enter Language Name"
                      value={languageName}
                      onChange={(e) => setLanguageName(e.target.value)}
                      icon="language"
                      iconPosition="left"
                    />
                    <Button type="submit" color="blue">Add</Button>
                  </Form>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <Header as="h3" icon>
                    <Icon name="globe" />
                    Select Language
                  </Header>
                  <Dropdown
                    placeholder="Select Language"
                    fluid
                    selection
                    options={languageOptions}
                    onChange={handleLanguageChange}
                  />
                  <Divider />
                  <Header as="h3" icon>
                    <Icon name="book" />
                    Add Chapter
                  </Header>
                  <Form onSubmit={handleChapterSubmit}>
                    <Form.Input
                      placeholder="Enter Chapter Name"
                      value={chapterName}
                      onChange={(e) => setChapterName(e.target.value)}
                      icon="book"
                      iconPosition="left"
                    />
                    <Button type="submit" color="blue">Add</Button>
                  </Form>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <Header as="h3" icon>
                    <Icon name="tasks" />
                    Select Chapter
                  </Header>
                  <Dropdown
                    placeholder="Select Chapter"
                    fluid
                    selection
                    options={chapterOptions}
                    onChange={handleChapterChange}
                  />
                  <Divider />
                  <Header as="h3" icon>
                    <Icon name="student" />
                    Add Lesson
                  </Header>
                  <Form onSubmit={handleLessonSubmit}>
                    <Form.Input
                      placeholder="Enter Lesson Name"
                      value={lessonName}
                      onChange={(e) => setLessonName(e.target.value)}
                      icon="student"
                      iconPosition="left"
                    />
                    <Button type="submit" color="blue">Add</Button>
                  </Form>
                </>
              )}

              {currentStep === 4 && (
                <>
                  <Header as="h3" icon>
                    <Icon name="list" />
                    Select Lesson
                  </Header>
                  <Dropdown
                    placeholder="Select Lesson"
                    fluid
                    selection
                    options={lessonOptions}
                    onChange={(e, { value }) => setSelectedLesson(value)}
                  />
                  {selectedLesson && (
                    <>
                      <Divider />
                      <Button color="blue" onClick={() => setModalOpen(true)}>Add Questions</Button>
                      <Modal
                        onClose={() => setModalOpen(false)}
                        onOpen={() => setModalOpen(true)}
                        open={modalOpen}
                      >
                        <Modal.Header>Add Question</Modal.Header>
                        <Modal.Content>
                          <Form onSubmit={handleQuestionSubmit}>
                            <Form.Input
                              label="Question Type"
                              placeholder="Enter Question Type"
                              value={questionType}
                              onChange={(e) => setQuestionType(e.target.value)}
                            />
                            <Form.TextArea
                              label="Question Text"
                              placeholder="Enter Question Text"
                              value={text}
                              onChange={(e) => setText(e.target.value)}
                            />
                            <Form.Input
                              label="Image 1 URL"
                              placeholder="Enter Image 1 URL"
                              value={image1}
                              onChange={(e) => setImage1(e.target.value)}
                            />
                            <Form.Input
                              label="Image 2 URL"
                              placeholder="Enter Image 2 URL (Optional)"
                              value={image2}
                              onChange={(e) => setImage2(e.target.value)}
                            />
                            <Form.Input
                              label="Audio 1 URL"
                              placeholder="Enter Audio 1 URL"
                              value={audio1}
                              onChange={(e) => setAudio1(e.target.value)}
                            />
                            <Form.Input
                              label="Audio 2 URL"
                              placeholder="Enter Audio 2 URL (Optional)"
                              value={audio2}
                              onChange={(e) => setAudio2(e.target.value)}
                            />
                            <Form.TextArea
                              label="Answer Text"
                              placeholder="Enter Answer Text"
                              value={answerText}
                              onChange={(e) => setAnswerText(e.target.value)}
                            />
                            <Button type="submit" color="blue">Add Question</Button>
                          </Form>
                        </Modal.Content>
                        <Modal.Actions>
                          <Button onClick={() => setModalOpen(false)} color="red">
                            Cancel
                          </Button>
                        </Modal.Actions>
                      </Modal>
                    </>
                  )}
                </>
              )}
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={16} textAlign="center">
              <Button.Group>
                <Button
                  color="grey"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={currentStep === 1}
                  style={{ marginRight: '10px' }}
                >
                  Previous
                </Button>
                <Button
                  color="blue"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={currentStep === steps.length}
                >
                  Next
                </Button>
              </Button.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Container>
  );
};

export default AddCourse;