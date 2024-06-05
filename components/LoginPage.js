import React, { useState } from 'react';
import { Button, Form, Grid, Header } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import '../public/css/LoginPage.css'; 

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/v1/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error('Invalid email or password');
      }
  
      const { token, userInfo } = await response.json();
      localStorage.setItem('token', token);
  
      if (userInfo.role === 'superadmin') {
        navigate('/superadmin');
      } else if (userInfo.role === 'instituteadmin') {
        navigate('/instituteadmin');
      } else if (userInfo.role === 'student') {
        // Navigate to '/student' and pass username in the state
        navigate('/student', { state: { username: userInfo.username } });
       
      }
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' textAlign='center' className='login-header'>
          Log in
        </Header>
        <Form size='large'>
          <Form.Field className='input-field'>
            <input
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Field>
          <Form.Field className='input-field password-wrapper'>
            <input
              placeholder='Password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a href='#' className='forgot-link'>FORGOT?</a>
          </Form.Field>
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          <Button fluid size='large' onClick={handleLogin} className='login-button'>
            LOG IN
          </Button>
        </Form>
        <hr style={{ margin: '20px 0', borderColor: '#ddd' }} />
        <div style={{ fontSize: '14px', color: '#bbb' }}>
          By signing in to Lantoon, you agree to our <a href='#'>Terms</a> and <a href='#'>Privacy Policy</a>.
        </div>
      </Grid.Column>
    </Grid>
  );
};

export default LoginPage;
