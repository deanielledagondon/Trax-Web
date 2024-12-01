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
  const [assignedWindow, setAssignedWindow] = useState(''); // Still needed for display purposes
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // State for Change Password Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          const { data, error } = await supabase
            .from('registrants')
            .select('full_name, email, role, window_no') // Fetch assigned window
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
            setAssignedWindow(data.window_no); // Display assigned window
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
        const { error } = await supabase
          .from('registrants')
          .update({ full_name: fullName, email, role: position }) // Removed window_no from update
          .eq('id', session.user.id);

        if (error) {
          console.error('Error saving user data:', error);
          alert('Failed to save changes.');
        } else {
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
        <div className="profile-field-row">
          <div className="profile-field">
            <label htmlFor="assignedWindow">Assigned Window</label>
            <input
              type="text"
              id="assignedWindow"
              value={assignedWindow}
              readOnly
            />
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

      {/* Password Change Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Change Password</h2>
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
