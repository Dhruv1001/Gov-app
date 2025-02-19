import React from 'react'
import { useNavigate } from 'react-router-dom';



const AdminDashB = () => {
 const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token'); 
        localStorage.removeItem('role'); // Remove token
        navigate('/Admin');  // Redirect to login page
      };

    return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default AdminDashB
