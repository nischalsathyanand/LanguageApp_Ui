import React, { useState, useEffect } from 'react';
import { Segment, Header, Grid, Step, Form, Button, Table } from 'semantic-ui-react';

const ViewCourses = () => {
    const [languages, setLanguages] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedChapter, setSelectedChapter] = useState('');
    const [selectedLesson, setSelectedLesson] = useState('');
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        // Fetch all languages when the component mounts
        fetch('http://localhost:3000/api/v1/languages')
            .then(response => response.json())
            .then(data => {
                setLanguages(data);
            })
            .catch(error => {
                console.error('Error fetching languages:', error);
            });
    }, []);

    const handleLanguageChange = (e, { value }) => {
        setSelectedLanguage(value);
        // Fetch chapters for the selected language
        fetch(`http://localhost:3000/api/v1/languages/${value}/chapters`)
            .then(response => response.json())
            .then(data => {
                setChapters(data);
                setSelectedChapter('');  // Reset selected chapter
                setLessons([]);  // Reset lessons
                setSelectedLesson('');  // Reset selected lesson
            })
            .catch(error => {
                console.error('Error fetching chapters:', error);
            });
    };

    const handleChapterChange = (e, { value }) => {
        setSelectedChapter(value);
        // Fetch lessons for the selected chapter and language
        fetch(`http://localhost:3000/api/v1/languages/${selectedLanguage}/chapters/${value}/lessons`)
            .then(response => response.json())
            .then(data => {
                setLessons(data);
                setSelectedLesson('');  // Reset selected lesson
            })
            .catch(error => {
                console.error('Error fetching lessons:', error);
            });
    };

    const handleLessonChange = (e, { value }) => {
        setSelectedLesson(value);
    };

    const handleSubmit = () => {
        // Fetch questions based on selected language, chapter, and lesson
        fetch(`http://localhost:3000/api/v1/languages/${selectedLanguage}/chapters/${selectedChapter}/lessons/${selectedLesson}/questions`)
            .then(response => response.json())
            .then(data => {
                setQuestions(data);
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
            });
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

    return (
        <>
            <Form style={{ marginBottom: '20px' }}>
                <Form.Group widths='equal'>
                    <Form.Dropdown
                        label='Select Language'
                        placeholder='Select Language'
                        fluid
                        selection
                        options={languageOptions}
                        onChange={handleLanguageChange}
                    />
                    <Form.Dropdown
                        label='Select Chapter'
                        placeholder='Select Chapter'
                        fluid
                        selection
                        options={chapterOptions}
                        onChange={handleChapterChange}
                        disabled={!selectedLanguage}
                    />
                    <Form.Dropdown
                        label='Select Lesson'
                        placeholder='Select Lesson'
                        fluid
                        selection
                        options={lessonOptions}
                        onChange={handleLessonChange}
                        disabled={!selectedChapter}
                    />
                    <Button color='blue' style={{ marginTop: '25px' }} onClick={handleSubmit}>
                        Submit
                    </Button>
                </Form.Group>
            </Form>
            {questions.length > 0 && (
                <Table celled selectable style={{ marginTop: '20px' }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Order ID</Table.HeaderCell>
                            <Table.HeaderCell>Question Type</Table.HeaderCell>
                            <Table.HeaderCell>Text</Table.HeaderCell>
                            <Table.HeaderCell>Image 1</Table.HeaderCell>
                            <Table.HeaderCell>Image 2</Table.HeaderCell>
                            <Table.HeaderCell>Audio 1</Table.HeaderCell>
                            <Table.HeaderCell>Audio 2</Table.HeaderCell>
                            <Table.HeaderCell>Answer Text</Table.HeaderCell>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {questions.map((question, index) => (
                            <Table.Row key={index}>
                                <Table.Cell>{question.order_id}</Table.Cell>
                                <Table.Cell>{question.question_type}</Table.Cell>
                                <Table.Cell>{question.text}</Table.Cell>
                                <Table.Cell>{question.image1}</Table.Cell>
                                <Table.Cell>{question.image2}</Table.Cell>
                                <Table.Cell>{question.audio1}</Table.Cell>
                                <Table.Cell>{question.audio2}</Table.Cell>
                                <Table.Cell>{question.answerText}</Table.Cell>
                                <Table.Cell>{question._id}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            )}
        </>
    );
};

export default ViewCourses;
