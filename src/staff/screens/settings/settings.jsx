import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SettingsSidebar from './settingsidebar/settingsidebar';
import StaffProfileSettings from './profile/profile';
import GeneralSettings from './general/general';
import './settings.scss'; // Create this file for styling if needed

const Settings = () => {
  return (
    <div className="settings-page">
      <SettingsSidebar />
      <div className="settings-content">
        <Routes>
          <Route path="profile" element={<StaffProfileSettings />} />
          <Route path="display" element={<GeneralSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default Settings;
