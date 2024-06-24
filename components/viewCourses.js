import React, { useState, useEffect } from 'react';
import { Form, Icon, Table, Container, Header, Divider, Message, Dimmer, Loader } from 'semantic-ui-react';

const ViewCourses = () => {
    const [languages, setLanguages] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedChapter, setSelectedChapter] = useState('');
    const [selectedLesson, setSelectedLesson] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLanguages();
    }, []);

    const fetchLanguages = () => {
        setLoading(true);
        setError('');

        fetch('/api/v1/languages')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch languages');
                }
                return response.json();
            })
            .then(data => {
                setLanguages(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching languages:', error);
                setError('Failed to fetch languages');
                setLoading(false);
            });
    };

    const handleLanguageChange = (e, { value }) => {
        setSelectedLanguage(value);
        setSelectedChapter('');
        setSelectedLesson('');
        setChapters([]);
        setLessons([]);
        setQuestions([]);

        fetchChapters(value);
    };

    const fetchChapters = (languageId) => {
        setLoading(true);
        setError('');

        fetch(`/api/v1/languages/${languageId}/chapters`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch chapters');
                }
                return response.json();
            })
            .then(data => {
                setChapters(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching chapters:', error);
                setError('Failed to fetch chapters');
                setLoading(false);
            });
    };

    const handleChapterChange = (e, { value }) => {
        setSelectedChapter(value);
        setSelectedLesson('');
        setLessons([]);
        setQuestions([]);

        fetchLessons(selectedLanguage, value);
    };

    const fetchLessons = (languageId, chapterId) => {
        setLoading(true);
        setError('');

        fetch(`/api/v1/languages/${languageId}/chapters/${chapterId}/lessons`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch lessons');
                }
                return response.json();
            })
            .then(data => {
                setLessons(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching lessons:', error);
                setError('Failed to fetch lessons');
                setLoading(false);
            });
    };

    const handleLessonChange = (e, { value }) => {
        setSelectedLesson(value);
    };

    const handleSubmit = () => {
        setLoading(true);
        setError('');

        fetch(`/api/v1/languages/${selectedLanguage}/chapters/${selectedChapter}/lessons/${selectedLesson}/questions`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch questions');
                }
                return response.json();
            })
            .then(data => {
                setQuestions(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
                setError('Failed to fetch questions');
                setLoading(false);
            });
    };

    const createOptions = (data) => data.map(item => ({
        key: item._id,
        text: item.name,
        value: item._id
    }));

    return (
        <Container>
            <Header as="h2" style={{ marginTop: '20px', textAlign: 'center' }}>View Courses</Header>
            
            {error && <Message negative>{error}</Message>}

            <Form style={{ marginBottom: '20px', textAlign: 'center' }}>
                <Form.Group widths='equal'>
                    <Form.Dropdown
                        label='Select Language'
                        placeholder='Select Language'
                        fluid
                        selection
                        options={createOptions(languages)}
                        onChange={handleLanguageChange}
                        value={selectedLanguage}
                        className="select"
                        loading={loading}
                    />
                    <Form.Dropdown
                        label='Select Chapter'
                        placeholder='Select Chapter'
                        fluid
                        selection
                        options={createOptions(chapters)}
                        onChange={handleChapterChange}
                        value={selectedChapter}
                        disabled={!selectedLanguage}
                        className="select"
                        loading={loading}
                    />
                    <Form.Dropdown
                        label='Select Lesson'
                        placeholder='Select Lesson'
                        fluid
                        selection
                        options={createOptions(lessons)}
                        onChange={handleLessonChange}
                        value={selectedLesson}
                        disabled={!selectedChapter}
                        className="select"
                        loading={loading}
                    />
                </Form.Group>
                <Icon 
                    name='search' 
                    size='big' 
                    color='blue' 
                    style={{ marginTop: '20px', cursor: 'pointer', marginLeft: '10px' }} 
                    onClick={handleSubmit} 
                    loading={loading}
                />
            </Form>

            <Divider />

            {loading && (
                <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                </Dimmer>
            )}

            {questions.length > 0 && (
                <Table celled selectable className="table">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Order ID</Table.HeaderCell>
                            <Table.HeaderCell>Question Type</Table.HeaderCell>
                            <Table.HeaderCell>Text</Table.HeaderCell>
                            <Table.HeaderCell>Image 1</Table.HeaderCell>
                            <Table.HeaderCell>Audio 1</Table.HeaderCell>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {questions.map((question) => (
                            <Table.Row key={question._id}>
                                <Table.Cell>{question.order_id}</Table.Cell>
                                <Table.Cell>{question.question_type}</Table.Cell>
                                <Table.Cell>{question.text}</Table.Cell>
                                <Table.Cell>{question.image1}</Table.Cell>
                                <Table.Cell>{question.audio1}</Table.Cell>
                                <Table.Cell>{question._id}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            )}
        </Container>
    );
};

export default ViewCourses;
