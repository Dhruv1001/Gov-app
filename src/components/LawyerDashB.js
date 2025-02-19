import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import axios from 'axios';


const LawyerDashB = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      navigate('/login');
      return;
    }
  
    axios.post('http://localhost:5000/api/dashboard', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => setUser(response.data.user))
    .catch((err) => {
      setError("Failed to fetch user data");
      localStorage.removeItem('token'); // Remove invalid token
      navigate('/login'); // Redirect to login
    });
  
  }, [navigate]);
 
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('role'); // Remove token
    navigate('/login');  // Redirect to login page
  };


  if (error) return 
  <div>{error}</div>;

  return (
    <div className='head'>
      <h1>Welcome to your Dashboard</h1>
      {user && <p>Welcome, {user.username}!</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default LawyerDashB;
