import React, { useState, useEffect } from 'react';
import './login.css';
import '../../App.scss';
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../components/helper/supabaseClient";
import video from '../../assets/videos/login-vid.mp4';
import logo from '../../assets/images/long-registrar.png';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useAuth } from '../../components/authContext';

const Login = () => {
  const { session } = useAuth();
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullEmail: '',
    fullPassword: '',
    rememberMe: false,
    showPassword: false  // state to manage password visibility, default is false (masked)
  });

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  // Toggle password visibility
  function togglePasswordVisibility() {
    setFormData(prevFormData => ({
      ...prevFormData,
      showPassword: !prevFormData.showPassword
    }));
  }

  useEffect(() => {
    if (session) {
      navigate('/dashboard'); // Redirect to dashboard if user is already logged in
    }
  }, [session, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.fullEmail,
        password: formData.fullPassword,
      });
      console.log(data);
      if (error) {
        console.error('Error signing in:', error.message);
        alert(`Login failed: ${error.message}`);
        return;
      }
      console.log('Sign-in successful:', data);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.session.access_token);
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', true);
      } else {
        localStorage.removeItem('rememberMe');
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  }

  return (
    <div className="loginPage flex">
      <div className="container flex">
        <div className='videoDiv'>
          <video src={video} autoPlay muted loop></video>
          <div className="textDiv">
            <h2 className='title'> Keeping your transactions on track </h2>
          </div>
          <div className="footerDiv flex">
            <span className="text"> Don't have an account?</span>
            <Link to={'/register'}>
              <button className="btn">Sign up for free</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={logo} alt="Logo Image" />
            <h3>Welcome Back!</h3>
          </div>

          <form action="" className='form grid' onSubmit={handleSubmit}>

            <div className="inputDiv">
              <div className="input flex">
                <input type="text" id="email" name="fullEmail" placeholder="Email" onChange={handleChange} />
              </div>
            </div>

            <div className="inputDiv">
              <div className="input flex">
                <input
                  type={formData.showPassword ? "text" : "password"}
                  id="password"
                  name="fullPassword"
                  placeholder="Password"
                  onChange={handleChange}
                />
                {formData.showPassword ?
                  <MdVisibility className="input-icon right-icon" onClick={togglePasswordVisibility} />
                  :
                  <MdVisibilityOff className="input-icon right-icon" onClick={togglePasswordVisibility} />
                }
              </div>
            </div>

            <div className="options flex">
              <div className="rememberMe flex">
                <input type="checkbox" id="rememberMe" name="rememberMe" onChange={handleChange} />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>
              <Link to="/forgot-password" className="forgotPassword">Forgot Password?</Link>
            </div>

            <button type="submit" className="btn">
              <span>SIGN IN</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
