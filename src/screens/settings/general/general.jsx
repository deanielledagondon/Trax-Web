import React, { useState } from 'react';
import './general.scss';

const GeneralSettings = () => {
  const [theme, setTheme] = useState('light');

  // Sample team members data
  const teamMembers = [
    { name: 'Alice', status: 'online' },
    { name: 'Bob', status: 'offline' },
    { name: 'Charlie', status: 'online' },
  ];

  return (
    <div className="container">
      <h1>General Settings</h1>
      
      <section>
        <h2>Theme</h2>
        <p>Select your UI theme.</p>
        <div className="theme-options">
          <label className="theme-option">
            <input
              type="radio"
              name="theme"
              value="light"
              checked={theme === 'light'}
              onChange={(e) => setTheme(e.target.value)}
            />
            <img src="path/to/light-theme-image.png" alt="Light Theme" />
            <span className="checkmark">✔</span>
          </label>
          <label className="theme-option">
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={theme === 'dark'}
              onChange={(e) => setTheme(e.target.value)}
            />
            <img src="path/to/dark-theme-image.png" alt="Dark Theme" />
            <span className="checkmark">✔</span>
          </label>
          <label className="theme-option">
            <input
              type="radio"
              name="theme"
              value="system"
              checked={theme === 'system'}
              onChange={(e) => setTheme(e.target.value)}
            />
            <img src="path/to/system-theme-image.png" alt="System Preference" />
            <span className="checkmark">✔</span>
          </label>
        </div>
      </section>
    </div>
  );
};

export default GeneralSettings;
