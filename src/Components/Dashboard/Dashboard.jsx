import React from "react"
import { useNavigate } from "react-router-dom/dist"
// import './Dashboard.css'

const Dashboard = ({token}) => {  
  let navigate = useNavigate()

  function handleLogout(){
    sessionStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div>
      {/*token.user.user_metadata.full_name */}
      <h3>Welcome, User {token}</h3>
      <button onClick={handleLogout}>Logout</button>
      <br />
      This is Dashboard Page
    </div>
  )
}

export default Dashboard
