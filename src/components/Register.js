import React, { useState } from 'react';
import axios from 'axios';
import './logins.css';

function Register() {
  const [currentPanel, setCurrentPanel] = useState('client');
  const [formData, setFormData] = useState({ fullname: '', username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const panelData = {
    client: { title: 'Client', description: 'Enter Details carefully.' },
    judge: { title: 'Judge', description: 'Enter Details carefully.' },
    lawyer: { title: 'Lawyer', description: 'Enter Details carefully.' }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullname, username, password } = formData;

    if (!fullname || !username || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        fullname,
        username,
        password,
        role: currentPanel  // Send role to backend
      });

      if (response.data) {
        setSuccessMessage('Registration successful!');
        setFormData({ fullname: '', username: '', password: '', role: '' });
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className="App">
      <div className="button-container">
        <button onClick={() => setCurrentPanel('client')}>Client</button>
        <button onClick={() => setCurrentPanel('judge')}>Judge</button>
        <button onClick={() => setCurrentPanel('lawyer')}>Lawyer</button>
      </div>

      <div className="panel">
        <h2>{panelData[currentPanel].title}</h2>
        <p>{panelData[currentPanel].description}</p>

        <h3>Register</h3>
        <form onSubmit={handleSubmit}>
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
          {successMessage && <div className="success-message">{successMessage}</div>}

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
