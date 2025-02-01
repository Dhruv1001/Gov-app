// import React, { useState } from 'react';
// import axios from 'axios';
// import './logins.css';
// import { useNavigate } from 'react-router-dom';  



// function Login() {
//   const [currentPanel, setCurrentPanel] = useState('client');
//   const [formData, setFormData] = useState({ fullname: '', username: '', password: '' });
//   const [errorMessage, setErrorMessage] = useState('');

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

//     try {
//       // Make a POST request to the server with the form data
//       const response = await axios.post('http://localhost:5000/api/login', {
//         username,
//         password,
//       });

//       // Check if login is successful (adjust according to your API response)
//       if (response.data) {
//         alert('Login successful!');
//         // Handle successful login (e.g., redirect to another page)

//         navigate('/Casedoc');  // Redirect to the dashboard page
//       }
//     } catch (err) {
//       setErrorMessage('Login failed: ' + err.message);
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

//           <button type="submit">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;
   

import React, { useState } from 'react';
import axios from 'axios';
import './logins.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [currentPanel, setCurrentPanel] = useState('client');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);  // Loading state for the button

  const panelData = {
    client: {
      title: 'Client',
      description: 'Please Enter Your Credentials.'
    },
    judge: {
      title: 'Judge',
      description: 'Please Enter Your Credentials'
    },
    lawyer: {
      title: 'Lawyer',
      description: 'Please Enter Your Credentials'
    }
  };

  const navigate = useNavigate();

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    // Simple validation
    if (!username || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setErrorMessage('');
    setLoading(true);  // Show loading spinner or disable button

    try {
      // Make a POST request to the server with the form data
      const response = await axios.post('http://localhost:5000/api/clients', {
        username,
        password,
      });

      // Check if login is successful
      if (response.data && response.data.success) {
        alert('Login successful!');
        navigate('/Casedoc');  // Redirect to the dashboard page
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (err) {
      setErrorMessage('Login failed: ' + err.message);
    } finally {
      setLoading(false);  // Hide loading state
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

        <h3>Login</h3>
        <form onSubmit={handleSubmit}>
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
