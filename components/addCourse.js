import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/languages');
      const data = await response.json();
      setLanguages(data);
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    fetchChapters(event.target.value);
  };

  const handleChapterChange = (event) => {
    setSelectedChapter(event.target.value);
    fetchLessons(selectedLanguage, event.target.value);
  };

  const fetchChapters = async (languageId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/languages/${languageId}/chapters`);
      const data = await response.json();
      setChapters(data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const fetchLessons = async (languageId, chapterId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/languages/${languageId}/chapters/${chapterId}/lessons`);
      const data = await response.json();
      setLessons(data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const handleLanguageSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/v1/languages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: languageName }),
      });
      const data = await response.json();
      setLanguages([...languages, data]);
      setLanguageName('');
    } catch (error) {
      console.error('Error creating language:', error);
    }
  };

  const handleChapterSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/v1/languages/${selectedLanguage}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: chapterName }),
      });
      const data = await response.json();
      setChapters([...chapters, data]);
      setChapterName('');
    } catch (error) {
      console.error('Error creating chapter:', error);
    }
  };

  const handleLessonSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/v1/languages/${selectedLanguage}/chapters/${selectedChapter}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: lessonName }),
      });
      const data = await response.json();
      setLessons([...lessons, data]);
      setLessonName('');
    } catch (error) {
      console.error('Error creating lesson:', error);
    }
  };

  const handleQuestionSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/v1/languages/${selectedLanguage}/chapters/${selectedChapter}/lessons/${selectedLesson}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question_type,
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
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const handleDeleteLanguage = async (languageId) => {
    try {
      await fetch(`http://localhost:3000/api/v1/languages/${languageId}`, {
        method: 'DELETE',
      });
      setLanguages(languages.filter((language) => language._id !== languageId));
    } catch (error) {
      console.error('Error deleting language:', error);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    try {
      await fetch(`http://localhost:3000/api/v1/languages/${selectedLanguage}/chapters/${chapterId}`, {
        method: 'DELETE',
      });
      setChapters(chapters.filter((chapter) => chapter._id !== chapterId));
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await fetch(`http://localhost:3000/api/v1/languages/${selectedLanguage}/chapters/${selectedChapter}/lessons/${lessonId}`, {
        method: 'DELETE',
      });
      setLessons(lessons.filter((lesson) => lesson._id !== lessonId));
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await fetch(`http://localhost:3000/api/v1/languages/${selectedLanguage}/chapters/${selectedChapter}/lessons/${selectedLesson}/questions/${questionId}`, {
        method: 'DELETE',
      });
      setQuestions(questions.filter((question) => question._id !== questionId));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Add New Course</h1>

      {/* Language Form */}
      <form onSubmit={handleLanguageSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Enter Language Name"
          value={languageName}
          onChange={(e) => setLanguageName(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add Language</button>
      </form>

      {/* Language Select */}
      <select value={selectedLanguage} onChange={handleLanguageChange} style={styles.select}>
        <option value="">Select Language</option>
        {languages.map((language) => (
          <option key={language._id} value={language._id}>
            {language.name}
          </option>
        ))}
      </select>

      {/* Delete Language */}
      {selectedLanguage && (
        <button onClick={() => handleDeleteLanguage(selectedLanguage)} style={styles.deleteButton}>Delete Language</button>
      )}

      {/* Chapter Form */}
      <form onSubmit={handleChapterSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Enter Chapter Name"
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add Chapter</button>
      </form>

      {/* Chapter Select */}
      <select value={selectedChapter} onChange={handleChapterChange} style={styles.select}>
        <option value="">Select Chapter</option>
        {chapters.map((chapter) => (
          <option key={chapter._id} value={chapter._id}>
            {chapter.name}
          </option>
        ))}
      </select>

      {/* Delete Chapter */}
      {selectedChapter && (
        <button onClick={() => handleDeleteChapter(selectedChapter)} style={styles.deleteButton}>Delete Chapter</button>
      )}

      {/* Lesson Form */}
      <form onSubmit={handleLessonSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Enter Lesson Name"
          value={lessonName}
          onChange={(e) => setLessonName(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add Lesson</button>
      </form>

      {/* Lesson Select */}
      <select value={selectedLesson} onChange={(e) => setSelectedLesson(e.target.value)} style={styles.select}>
        <option value="">Select Lesson</option>
        {lessons.map((lesson) => (
          <option key={lesson._id} value={lesson._id}>
            {lesson.name}
          </option>
        ))}
        </select>
  
        {/* Delete Lesson */}
        {selectedLesson && (
          <button onClick={() => handleDeleteLesson(selectedLesson)} style={styles.deleteButton}>Delete Lesson</button>
        )}
  
        {/* Question Form */}
        <form onSubmit={handleQuestionSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Question Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={styles.input}
          />
          {/* Add other fields here */}
          <button type="submit" style={styles.button}>Add Question</button>
        </form>
  
        {/* Questions List */}
        <ul style={styles.list}>
          {questions.map((question) => (
            <li key={question._id} style={styles.listItem}>
              {question.text}{' '}
              <button onClick={() => handleDeleteQuestion(question._id)} style={styles.deleteButton}>Delete</button>
            </li>
          ))}
        </ul>
  
        {/* Back Button */}
        <button onClick={() => setActiveStep(1)} style={styles.backButton}>Back</button>
      </div>
    );
  };
  
  export default AddCourse;
  
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',  // Light gray background
    },
    title: {
      fontSize: '24px',
      marginBottom: '20px',
      textAlign: 'center',
      color: '#007bff',  // Primary blue color
    },
    form: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
    },
    input: {
      flex: 1,
      padding: '8px',
      marginRight: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
    },
    button: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      background: '#007bff',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '14px',
    },
    select: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '14px',
      marginBottom: '10px',
      outline: 'none',
    },
    deleteButton: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      background: '#dc3545',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '14px',
      marginLeft: '10px',
    },
    list: {
      listStyleType: 'none',
      padding: '0',
    },
    listItem: {
      marginBottom: '5px',
      fontSize: '14px',
    },
    backButton: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      background: '#6c757d',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '14px',
      marginTop: '20px',
    },
  };
  