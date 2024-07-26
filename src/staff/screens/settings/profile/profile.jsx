import React, { useState, useEffect } from 'react';
import './profile.scss';
import { supabase } from '../../../components/helper/supabaseClient';
import { useAuth } from '../../../../components/authContext';

const ProfileSettings = () => {
  const { session } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          const { data, error } = await supabase
            .from('registrants')
            .select('full_name, email, role')
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
          .update({ full_name: fullName, email, role: position })
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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
        <button className="save-changes-btn" onClick={handleSaveChanges}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
