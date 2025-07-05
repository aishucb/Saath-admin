import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('[Login] Attempting login with:', { email });
    console.log('[Login] Full form data:', { email, password: '***' });

    try {
      const response = await api.post('/admin/login', {
        email,
        password
      });

      // Save token to localStorage
      localStorage.setItem('adminToken', response.data.token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Login error response:', err.response.data);
        
        if (err.response.status === 400) {
          errorMessage = err.response.data.message || 'Invalid email or password';
        } else if (err.response.status === 401) {
          errorMessage = 'Unauthorized. Please check your credentials.';
        } else if (err.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request
        console.error('Login error:', err.message);
        errorMessage = 'Error setting up login request.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#fff9fb',
      padding: '20px'
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#621d1d', margin: 0 }}>❤️</h1>
        <h2 style={{ color: '#333', margin: '1rem 0 0.5rem' }}>Welcome again!</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Please enter your details</p>
        
        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#d32f2f',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'left',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}
        
        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#666',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>Email</label>
          <input 
            type="email" 
            name="email"
            value={email}
            onChange={handleChange}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s',
              ':focus': {
                borderColor: '#621d1d'
              }
            }}
            placeholder="Enter your email"
          />
        </div>

        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}>
            <label style={{
              color: '#666',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>Password</label>
            <button 
              type="button"
              onClick={() => {}}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                fontSize: '0.75rem',
                padding: '4px 0',
                ':hover': {
                  textDecoration: 'underline'
                }
              }}
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>
          <input 
            type="password" 
            name="password"
            value={password}
            onChange={handleChange}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s',
              ':focus': {
                borderColor: '#621d1d'
              }
            }}
            placeholder="Enter your password"
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: loading ? '#ff9eb9' : '#621d1d',
            color: 'white',
            border: 'none',
            padding: '0.875rem',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '0.5rem',
            transition: 'background-color 0.2s',
            ':hover': {
              backgroundColor: loading ? '#ff9eb9' : '#ff4d8d'
            }
          }}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
