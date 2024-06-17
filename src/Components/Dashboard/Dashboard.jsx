import React, { useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom/dist"

const Dashboard = ({token}) => {  
  const [user, setUser] = useState(null);
  let navigate = useNavigate()

  function handleLogout(){
    localStorage.removeItem('sb-swqywqargpfwcyvpqhkn-auth-token')
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/')
  }

  useEffect(() => {
    // Retrieve the user data from local storage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      alert('No user data found. Please log in.');
      navigate('/'); // Redirect to login if no user data found
      return;
    }

    setUser(storedUser);
  }, [navigate]);

  //   // Retrieve the user data from local storage
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   const token = localStorage.getItem('token');

  //   if (!user || !token) {
  //     alert('No user data found. Please log in.');
  //     navigate('/') // Redirect to login if no user data found
  //     return;
  //   }

  //   console.log(user)
  //   console.log(token)
  //   // Display user data on the dashboard
  //   document.getElementById('user').textContent = `Welcome, ${user.user_metadata.full_name}`
  // });

  return (
    <div>
      <h3>Welcome, {user ? user.user_metadata.full_name : 'User'}</h3>
      <p>Email: {user ? user.user_metadata.email : 'Email'}</p>
      <button onClick={handleLogout}>Logout</button>
      <br />
      This is Dashboard Page
    </div>
  )
}

export default Dashboard
