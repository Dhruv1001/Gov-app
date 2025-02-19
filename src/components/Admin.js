import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './logins.css';

function Admin() {
  const [currentPanel, setCurrentPanel] = useState('');
  const [formData, setFormData] = useState({ fullname: '', username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      navigate(`/${role}DashB`); // Redirect based on the stored role
    }
  }, [navigate]);

  // Handle form submission for both Register and Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullname, username, password } = formData;

    if (currentPanel === 'Register') {
      // Registration Logic
      if (!fullname || !username || !password) {
        setErrorMessage('Please fill in all fields');
        return;
      }

      setErrorMessage('');
      setLoading(true);

      try {
        const response = await axios.post('http://localhost:5000/api/register', {
          fullname,
          username,
          password,
          role : 'admin',
        });

        if (response.data && response.data.message === 'Registration successful') {
          alert('Registration successful!');
          setCurrentPanel('Login'); // Switch to the Login panel
        } else {
          setErrorMessage(response.data.message || 'Registration failed');
        }
      } catch (err) {
        setErrorMessage('Registration failed: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    } else {
      // Login Logic
      if (!username || !password) {
        setErrorMessage('Please fill in all fields');
        return;
      }

      setErrorMessage('');
      setLoading(true);

      try {
        const response = await axios.post('http://localhost:5000/api/login', {
          username,
          password,
          role : 'admin',
        });

        if (response.data && response.data.message === 'Login successful') {
          alert('Login successful!');
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('role', response.data.role);
          navigate(`/${response.data.role}DashB`);
        } else {
          setErrorMessage('Invalid username or password');
        }
      } catch (err) {
        setErrorMessage('Login failed: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="App">
      <div className="button-container">
        <button onClick={() => setCurrentPanel('Register')}>Register</button>
        <button onClick={() => setCurrentPanel('Login')}>Login</button>
      </div>

      {currentPanel && (
        <div className="panel">
          <h2>{currentPanel} Login</h2>
          <p>Please Enter Your Credentials.</p>

          <form onSubmit={handleSubmit}>
            {currentPanel === 'Register' && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <button type="submit" disabled={loading}>
              {loading ? (currentPanel === 'Register' ? 'Registering...' : 'Logging in...') : currentPanel}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Admin;


