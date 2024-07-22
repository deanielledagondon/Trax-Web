import React, { useState } from 'react';
import './profile.scss';

const ProfileSettings = () => {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [position, setPosition] = useState('Software Engineer');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSaveChanges = () => {
    console.log('Changes saved', { firstName, lastName, email, position });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`profile-settings ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="profile-header">
        <div className="profile-image-container">
          <img 
            src="https://via.placeholder.com/100" 
            alt="Profile" 
            className="profile-image"
          />
          <button className="change-picture-btn">Change Picture</button>
        </div>
        <div className="profile-info">
          <div className="profile-name">John Doe</div>
          <div className="profile-position">Software Engineer</div>
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
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
        </div>
        <button className="save-changes-btn" onClick={handleSaveChanges}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
