import React, { useState } from 'react';
import './register.css';
import '../../App.css';
import { Link } from "react-router-dom";
import { supabase } from "../../components/helper/supabaseClient";
import { MdVisibility, MdVisibilityOff, MdCheckCircle, MdCancel } from "react-icons/md";

import video from '../../assets/videos/registrar vid placeholder.mp4';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    fullEmail: '',
    fullPassword: '',
    confirmPassword: ''
  });
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));

    if (name === 'confirmPassword') {
      setPasswordMatch(formData.fullPassword === value);
    }
  }

  function togglePasswordVisibility() {
    setShowPassword(prevShowPassword => !prevShowPassword);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (!passwordMatch) {
        alert('Passwords do not match');
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.fullEmail,
        password: formData.fullPassword,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });
      if (error) throw error;
      alert('Check your email for verification link');
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="registerPage flex">
      <div className="container flex">

        <div className='videoDiv'>
          <video src={video} autoPlay muted loop></video>

          <div className="textDiv">
            <h2 className='title'> Where every transaction matters </h2>
          </div>

          <div className="footerDiv flex">
            <span className="text"> Already have an account?</span>
            <Link to={'/'}>
              <button className="btn">Sign in</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <h3>Create Account</h3>
          </div>

          <form action="" className='form grid' onSubmit={handleSubmit}>

            <div className="inputDiv">
              <div className="input flex">
                <input type="text" id="name" name="fullName" placeholder="Full Name" onChange={handleChange} />
              </div>
            </div>

            <div className="inputDiv">
              <div className="input flex">
                <input type="text" id="email" name="fullEmail" placeholder="Email" onChange={handleChange} />
              </div>
            </div>

            <div className="inputDiv">
              <div className="input flex">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="fullPassword"
                  placeholder="Password"
                  onChange={handleChange}
                />
                {showPassword ?
                  <MdVisibilityOff className="input-icon" onClick={togglePasswordVisibility} />
                  :
                  <MdVisibility className="input-icon" onClick={togglePasswordVisibility} />
                }
              </div>
            </div>

            <div className="inputDiv">
              <div className="input flex">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                />
                {formData.confirmPassword && (
                  passwordMatch ? <MdCheckCircle style={{ color: 'green', marginLeft: '10px' }} /> : <MdCancel style={{ color: 'red', marginLeft: '10px' }} />
                )}
              </div>
            </div>

            <button type="submit" className="btn flex">
              <span>Sign Up</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
