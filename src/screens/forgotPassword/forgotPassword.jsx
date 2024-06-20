import React, { useState } from 'react';
import './forgotPassword.scss'; // Import specific styles for Forgot Password page
import { Link } from 'react-router-dom';
import { supabase } from "../../components/helper/supabaseClient";
import { MdVisibility, MdVisibilityOff, MdCheckCircle, MdCancel } from "react-icons/md";

import video from '../../assets/videos/registrar vid placeholder.mp4'; // Adjusted video import path

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));

    if (name === 'confirmNewPassword') {
      setPasswordMatch(formData.newPassword === value);
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

      // Handle password reset logic with Supabase
      const { error } = await supabase.auth.api.resetPasswordForEmail(formData.newPassword);
      if (error) {
        throw error;
      }
      alert('Password reset successfully. Check your email for further instructions.');
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="forgotPasswordPage">
      <div className="container">

        <div className='videoDiv'>
          <video src={video} autoPlay muted loop></video>
          <div className="footerDiv">
            <span className="text">Remember your password?</span>
            <Link to={'/'}>
              <button className="btn">Sign in</button>
            </Link>
          </div>
        </div>

        <div className="formDiv">
          <div className="headerDiv">
            <h3>Reset Password</h3>
          </div>

          <form className='form' onSubmit={handleSubmit}>

            <div className="inputDiv">
              <div className="input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter New Password"
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
              <div className="input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  placeholder="Confirm New Password"
                  onChange={handleChange}
                />
                {formData.confirmNewPassword && (
                  passwordMatch ? <MdCheckCircle style={{ color: 'green', marginLeft: '10px' }} /> : <MdCancel style={{ color: 'red', marginLeft: '10px' }} />
                )}
              </div>
            </div>

            <button type="submit" className="btn">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
