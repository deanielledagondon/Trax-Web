import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SettingsSidebar from './settingsidebar/settingsidebar';
import ProfileSettings from './profile/profile';
import ManageUsers from './manageUsers/manageUsers';
import './settings.scss'; // Create this file for styling if needed

const Settings = () => {
  return (
    <div className="settings-page">
      <SettingsSidebar />
      <div className="settings-content">
        <Routes>
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="manageUsers" element={<ManageUsers />} />
        </Routes>
      </div>
    </div>
  );
};

export default Settings;
