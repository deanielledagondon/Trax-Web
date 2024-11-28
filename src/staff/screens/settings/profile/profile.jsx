import React, { useState, useEffect } from 'react';
import './profile.scss';
import { supabase } from '../../../components/helper/supabaseClient';
import { useAuth } from '../../../../components/authContext';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const ProfileSettings = () => {
  const { session } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [assignedWindow, setAssignedWindow] = useState(''); // Added state for assigned window
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);


    // State for Change Password Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false); // Visibility toggle for New Password
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Visibility toggle for Confirm Password

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          const { data, error } = await supabase
            .from('registrants')
            .select('full_name, email, role, window_no') // Added window_no to select statement
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user data:', error);
          } else {
            const nameParts = data.full_name.split(' ');
            setFirstName(nameParts[0]);
            setLastName(nameParts.slice(1).join(' '));
            setEmail(data.email);
            setPosition(data.role);
            setAssignedWindow(data.window_no); // Set assigned window
          }
        } catch (error) {
          console.error('Unexpected error:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const handleSaveChanges = async () => {
    if (session) {
      try {
        const fullName = `${firstName} ${lastName}`;
        const { data, error } = await supabase
          .from('registrants')
          .update({ full_name: fullName, email, role: position, window_no: assignedWindow }) // Added window_no to update
          .eq('id', session.user.id);

        if (error) {
          console.error('Error saving user data:', error);
          alert('Failed to save changes.');
        } else {
          console.log('Changes saved', data);
          alert('Changes saved successfully.');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };


  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Error updating password:', error);
        alert('Failed to update password.');
      } else {
        alert('Password updated successfully.');
        setIsModalOpen(false);
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`profile-settings ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="profile-header">
        {/* <div className="profile-image-container">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="profile-image"
          />
        </div> */}
        <div className="profile-info">
          <div className="profile-name">{`${firstName} ${lastName}`}</div>
          <div className="profile-position">{position}</div>
        </div>
      </div>
      <div className="profile-details">
        <div className="profile-field-row">
          <div className="profile-field">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="profile-field">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="profile-field-row">
          <div className="profile-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="profile-field">
            <label htmlFor="position">Position</label>
            <input
              type="text"
              id="position"
              value={position}
              readOnly
            />
          </div>
        </div>
        <div className="profile-field-row"> {/* Added select field for assigned window */}
          <div className="profile-field">
            <label htmlFor="assignedWindow">Assigned Window</label>
            <select
              id="assignedWindow"
              value={assignedWindow}
              onChange={(e) => setAssignedWindow(e.target.value)}
            >
              <option value="">Select a window</option>
              <option value="W1">Window 1</option>
              <option value="W2">Window 2</option>
              <option value="W3">Window 3</option>
              <option value="W4">Window 4</option>
              <option value="W5">Window 5</option>
              <option value="W6">Window 6</option>
            </select>
          </div>
        </div>
        <div className="profile-buttons">
          <button className="save-changes-btn" onClick={handleSaveChanges}>
            Save Changes
          </button>
          <button className="change-password-btn" onClick={() => setIsModalOpen(true)}>
            Change Password
          </button>
        </div>
      </div>


 {/* Modal for Change Password */}
{isModalOpen && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Change Password</h2>
      {/* New Password Field */}
      <div className="modal-field">
        <label htmlFor="newPassword">New Password</label>
        <div className="password-input-wrapper">
          <input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
          {showNewPassword ? (
            <MdVisibilityOff
              className="input-icon"
              onClick={() => setShowNewPassword(!showNewPassword)}
            />
          ) : (
            <MdVisibility
              className="input-icon"
              onClick={() => setShowNewPassword(!showNewPassword)}
            />
          )}
        </div>
      </div>
      {/* Confirm Password Field */}
      <div className="modal-field">
        <label htmlFor="confirmPassword">Confirm New Password</label>
        <div className="password-input-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {showConfirmPassword ? (
            <MdVisibilityOff
              className="input-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}

            />
          ) : (
            <MdVisibility
              className="input-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          )}
        </div>
      </div>
      {/* Buttons */}
      <div className="modal-buttons">
        <button onClick={handlePasswordChange}>Confirm</button>
        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ProfileSettings;
