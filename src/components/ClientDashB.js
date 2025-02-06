import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClientDashB = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    axios
      .get('http://localhost:5000/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUser(response.data.user))
      .catch(() => {
        localStorage.removeItem('token'); // Remove invalid token
        navigate('/login'); // Redirect to login
      });
  }, [navigate]);

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      {user && <p>Welcome, {user.username}!</p>}
    </div>
  );
};

export default ClientDashB;
