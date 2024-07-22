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
            to="/settings/profile" 
            className={`settings-menu-link ${location.pathname === '/settings/profile' ? 'active' : ''}`}>
            Profile
          </Link>
        </li>
        <li className="settings-menu-item">
          <Link 
            to="/settings/manageUsers" 
            className={`settings-menu-link ${location.pathname === '/settings/manageUsers' ? 'active' : ''}`}>
            Manage Users 
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SettingsSidebar;
