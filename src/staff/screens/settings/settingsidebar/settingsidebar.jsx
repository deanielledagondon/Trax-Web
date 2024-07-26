import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './settingsidebar.scss';

const SettingsSidebar = () => {
  const location = useLocation();

  return (
    <div className="settings-sidebar">
      <ul className="settings-menu-list">
        <li className="settings-menu-item">
          <Link 
            to="/staff-settings/profile" 
            className={`settings-menu-link ${location.pathname === '/staff-settings/profile' ? 'active' : ''}`}>
            Profile
          </Link>
        </li>
        <li className="settings-menu-item">
          <Link 
            to="/staff-settings/display" 
            className={`settings-menu-link ${location.pathname === '/staff-settings/display' ? 'active' : ''}`}>
            General 
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SettingsSidebar;
