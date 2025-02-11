import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './logins.css';

function Login() {
  const [currentPanel, setCurrentPanel] = useState('');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Retrieve stored role

    if (token && role) {
      navigate(`/${role}DashB`); // Redirect based on the stored role
    }
  }, [navigate]);

  // ✅ Handle Form Submission (Login)
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
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
        role: currentPanel, // Convert role to lowercase to match backend
      });

      if (response.data && response.data.message === 'Login successful') {
        alert('Login successful!');

        // ✅ Store JWT token & role in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);

        // ✅ Redirect to the appropriate dashboard
        navigate(`/${response.data.role}DashB`);
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (err) {
      setErrorMessage('Login failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Input Change
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
        <button onClick={() => setCurrentPanel('Client')}>Client</button>
        <button onClick={() => setCurrentPanel('Judge')}>Judge</button>
        <button onClick={() => setCurrentPanel('Lawyer')}>Lawyer</button>
      </div>

      {currentPanel && (
        <div className="panel">
          <h2>{currentPanel.charAt(0).toUpperCase() + currentPanel.slice(1)} Login</h2>
          <p>Please Enter Your Credentials.</p>

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
      )}
    </div>
  );
}

export default Login;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './logins.css';
// import { useNavigate } from 'react-router-dom';

// function Login() {
//   const [currentPanel, setCurrentPanel] = useState('');
//   const [formData, setFormData] = useState({ username: '', password: '' });
//   const [errorMessage, setErrorMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Redirect if already logged in
//     const token = localStorage.getItem('token');
//     if (token) {
//       navigate(`/${currentPanel}DashB`);
//     }
//   }, [navigate, currentPanel]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { username, password } = formData;

//     if (!username || !password) {
//       setErrorMessage('Please fill in all fields');
//       return;
//     }

//     setErrorMessage('');
//     setLoading(true);

//     try {
//       const response = await axios.post('http://localhost:5000/api/log', { username, password, role: currentPanel });

//       if (response.data && response.data.message === 'Login successful') {
//         alert('Login successful!');
        
//         // Store the JWT token in localStorage
//         localStorage.setItem('token', response.data.token);
        
//         // Redirect to the appropriate dashboard
//         navigate(`/${currentPanel}DashB`);
//       } else {
//         setErrorMessage('Invalid username or password');
//       }
//     } catch (err) {
//       setErrorMessage('Login failed: ' + err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   return (
//     <div className="App">
//       <div className="button-container">
//         <button onClick={() => setCurrentPanel('Client')}>Client</button>
//         <button onClick={() => setCurrentPanel('Judge')}>Judge</button>
//         <button onClick={() => setCurrentPanel('Lawyer')}>Lawyer</button>
//       </div>

//       <div className="panel">
//         <h2>{currentPanel.charAt(0).toUpperCase() + currentPanel.slice(1)} Login</h2>
//         <p>Please Enter Your Credentials.</p>

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Username</label>
//             <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Enter your username" />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" />
//           </div>

//           {errorMessage && <div className="error-message">{errorMessage}</div>}

//           <button type="submit" disabled={loading}>
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;
