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
      console.log(userInfo)
  
  
      localStorage.setItem('token', token);
      sessionStorage.setItem('username', userInfo.username);
      sessionStorage.setItem('institutekey', userInfo.instituteKey); 
      sessionStorage.setItem('name', userInfo.name); 
      sessionStorage.setItem('role', userInfo.role); // Ensure role is stored
     // Assuming userInfo.allowedLanguages is an array of language names like ['English', 'German']
sessionStorage.setItem('languages', JSON.stringify(userInfo.allowedLanguages));

      if (userInfo.role === 'superadmin') {
        navigate('/superadmin');
      } else if (userInfo.role === 'instituteadmin') {
        navigate('/instituteadmin');
      } else if (userInfo.role === 'student') {
        navigate('/languages');
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
