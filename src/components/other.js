import React, { useState } from 'react';
import './Signup.css'; // Assuming you have styles for login

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!name || !username || !password) {
      setError('All fields are required');
      return;
    }

    // Simulate form submission (you can replace this with actual logic)
    console.log('User registered:', { name, username, password });
    
    // Optionally, redirect or clear the form after submission
    // navigate("/dashboard"); // If using react-router for navigation
  };

  return (
    <div>
      <form action="client" method='POST' onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input 
            type='text' 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name" 
          />
        </div>
        
        <div>
          <label>Username</label>
          <input 
            type='text' 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            name="Uname" 
          />
        </div>
        
        <div>
          <label>Password</label>
          <input 
            type='password' 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password" 
          />
        </div>

        {error && <p className="error">{error}</p>} 

        <button type='submit'>Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
