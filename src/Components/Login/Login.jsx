import React, { useState, useEffect } from 'react';
import './Login.css'
import '../../App.scss'
import { Link, NavLink, useNavigate} from "react-router-dom"
import { supabase } from '../Helper/supabaseClient';

import video from '../../Assets/login-vid.mp4'
import logo from '../../Assets/long-registrar.png'
import { MdAlternateEmail } from "react-icons/md";
import { TbPassword } from "react-icons/tb"
import { useAuth } from '../AuthContext';


const Login = () => {
  const { session } = useAuth();
  let navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullEmail: '', fullPassword: ''
  })

  console.log(formData)

  function handleChange(event){
    setFormData((prevFormData)=>{
      return{
        ...prevFormData,[event.target.name]:event.target.value
      }
    })
  }

  useEffect(() => {
    if (session) {
      navigate('/dashboard'); // Redirect to dashboard if user is already logged in
    }
  }, [session, navigate]);

  async function handleSubmit(e){
    e.preventDefault()
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.fullEmail,
        password: formData.fullPassword,
      })
      console.log(data)
      if (error) {
        console.error('Error signing in:', error.message);
        alert(`Login failed: ${error.message}`);
        return;
      }
      console.log('Sign-in successful:', data);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.session.access_token);
      navigate('/dashboard')
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  }


  return (
    <div className="loginPage flex">
    <div className="container flex">

    
      <div className = 'videoDiv'> 
        <video src={video} autoPlay muted loop></video>

      <div className="textDiv">
        <h2 className= 'title'> Keeping your transactions on track </h2>
        {/* <p> with Trax </p> */}
      </div>


      <div className="footerDiv flex">
        <span className="text"> Don't have an account?</span>
        <Link to = {'/register'}>
        <button className="btn">Sign Up</button>
        </Link>
      </div>
      </div>


      <div className="formDiv flex">
        <div className="headerDiv">
          <img src= {logo} alt="Logo Image"></img>
          <h3>Welcome Back!</h3>
        </div>

        <form action="" className='form grid' onSubmit={handleSubmit}>
          {/* <span>Please login to continue</span> */}
          <div className="inputDiv">
            <label htmlFor ="email" >Email</label>
            <div className="input flex">
              <MdAlternateEmail className='icon'/>
              <input type="text" id="email" name="fullEmail" placeholder="Enter Email" onChange={handleChange}/>
            </div>
          </div>

          <div className="inputDiv">
            <label htmlFor ="password" >Password</label>
            <div className="input flex">
              <TbPassword className='icon'/>
              <input type="password" id="password" name="fullPassword" placeholder="Enter Password" onChange={handleChange}/>
            </div>
          </div>


          <button type="submit" className="btn flex">
            <span>Login</span>
          </button>

          <span className="forgotPassword">
            Forgot your password? <a href="">Click Here</a>
          </span>

        </form>
      </div>




    </div>
    </div>

  )
}

export default Login