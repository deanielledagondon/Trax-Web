import React, { useState, useEffect } from 'react';
import { supabase } from '../../../components/helper/supabaseClient';
import { useAuth } from '../../../components/authContext';
import './profile.scss';

const ProfileSettings = () => {
  const { session } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [assignedWindow, setAssignedWindow] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/100');

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          const { data, error } = await supabase
            .from('registrants')
            .select('full_name, email, role, assigned_window, profile_image')
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
            setAssignedWindow(data.assigned_window);
            setProfileImage(data.profile_image || 'https://via.placeholder.com/100');
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
          .update({ full_name: fullName, email, role: position, assigned_window: assignedWindow })
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

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file && session) {
      const filePath = `${session.user.id}/${file.name}`;
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload image.');
      } else {
        const { publicURL, error: publicURLError } = supabase.storage
          .from('profile-images')
          .getPublicUrl(filePath);

        if (publicURLError) {
          console.error('Error getting public URL:', publicURLError);
          alert('Failed to get image URL.');
        } else {
          setProfileImage(publicURL);
          const { data, error: updateError } = await supabase
            .from('registrants')
            .update({ profile_image: publicURL })
            .eq('id', session.user.id);

          if (updateError) {
            console.error('Error updating profile image:', updateError);
            alert('Failed to update profile image.');
          } else {
            console.log('Profile image updated', data);
            alert('Profile image updated successfully.');
          }
        }
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`profile-settings ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="profile-header">
        <div className="profile-image-container">
          <img
            src={profileImage}
            alt="Profile"
            className="profile-image"
          />
          <input
            type="file"
            accept="image/*"
            id="profile-image-input"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <button
            className="change-picture-btn"
            onClick={() => document.getElementById('profile-image-input').click()}
          >
            Change Picture
          </button>
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
        <div className="profile-field-row">
          <div className="profile-field">
            <label htmlFor="assignedWindow">Assigned Window</label>
            <select
              id="assignedWindow"
              value={assignedWindow}
              onChange={(e) => setAssignedWindow(e.target.value)}
            >
              <option value="">Select a window</option>
              <option value="1">Window 1</option>
              <option value="2">Window 2</option>
              <option value="3">Window 3</option>
              <option value="4">Window 4</option>
              <option value="5">Window 5</option>
              <option value="6">Window 6</option>
            </select>
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
