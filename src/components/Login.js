// import React, { useState } from 'react';
// import axios from 'axios';
// import './logins.css';
// import { useNavigate } from 'react-router-dom';

// function Login() {
//   const [currentPanel, setCurrentPanel] = useState('client');
//   const [formData, setFormData] = useState({ username: '', password: '' });
//   const [errorMessage, setErrorMessage] = useState('');
//   const [loading, setLoading] = useState(false);  // Loading state for the button

//   const panelData = {
//     client: {
//       title: 'Client',
//       description: 'Please Enter Your Credentials.'
//     },
//     judge: {
//       title: 'Judge',
//       description: 'Please Enter Your Credentials'
//     },
//     lawyer: {
//       title: 'Lawyer',
//       description: 'Please Enter Your Credentials'
//     }
//   };

//   const navigate = useNavigate();

//   // Form submit handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { username, password } = formData;

//     // Simple validation
//     if (!username || !password) {
//       setErrorMessage('Please fill in all fields');
//       return;
//     }

//     setErrorMessage('');
//     setLoading(true);  // Show loading spinner or disable button
  
//       try {
//       const response = await axios.post('http://localhost:5000/api/log', { username, password });
//       if (response.data && response.data.message === 'Login successful') {
//         alert('Login successful!');
//         // navigate('/Casedoc');
//       } else {
//         setErrorMessage('Invalid username or password');
//       }
//     } catch (err) {
//       setErrorMessage('Login failed: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
 

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value
//     }));
//   };

//   return (
//     <div className="App">
//       <div className="button-container">
//         <button onClick={() => setCurrentPanel('client')}>Client</button>
//         <button onClick={() => setCurrentPanel('judge')}>Judge</button>
//         <button onClick={() => setCurrentPanel('lawyer')}>Lawyer</button>
//       </div>

//       <div className="panel">
//         <h2>{panelData[currentPanel].title}</h2>
//         <p>{panelData[currentPanel].description}</p>

//         <h3>Login</h3>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Username</label>
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               placeholder="Enter your username"
//             />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//             />
//           </div>

//           {errorMessage && <div className="error-message">{errorMessage}</div>}

//           <button type="submit" disabled={loading}>
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );

// };
// export default Login;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './logins.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [currentPanel, setCurrentPanel] = useState('client');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/ClientDashB');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/log', { username, password });

      if (response.data && response.data.message === 'Login successful') {
        alert('Login successful!');

        // Store the JWT token in localStorage
        localStorage.setItem('token', response.data.token);

        // Redirect to ClientDashB
        navigate('/ClientDashB');
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (err) {
      setErrorMessage('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

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
        <button onClick={() => setCurrentPanel('client')}>Client</button>
        <button onClick={() => setCurrentPanel('judge')}>Judge</button>
        <button onClick={() => setCurrentPanel('lawyer')}>Lawyer</button>
      </div>

      <div className="panel">
        <h2>{currentPanel}</h2>
        <p>Please Enter Your Credentials.</p>

        <h3>Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Enter your username" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" />
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
