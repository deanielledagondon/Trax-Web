import React, { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import BaseLayout from "./layout/BaseLayout";
import Login from './screens/login/login';
import Register from './screens/register/register';
import Queue from './screens/queue/queue';
import LogHistory from './screens/logbook/logHistory';
import Analytics from './screens/analytics/analytics';
import Feedback from './screens/feedback/feedback';
import { PageNotFound, Dashboard } from "./screens";
import ForgotPassword from "./screens/forgotPassword/forgotPassword";

import Settings from './screens/settings/settings'

import { AuthProvider } from './components/authContext';

import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";

const ThemeToggleButton = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const noToggleButtonPaths = ['/', '/register', '/forgot-password'];

  return (
    !noToggleButtonPaths.includes(location.pathname) && (
      <button
        type="button"
        className="theme-toggle-btn"
        onClick={toggleTheme}
      >
        <img
          className="theme-icon"
          src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
        />
      </button>
    )
  );
};

function App() {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<BaseLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/queue" element={<Queue />} />
            <Route path="/logbook" element={<LogHistory />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/settings/*" element={<Settings />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>

        <ThemeToggleButton />
      </Router>
    </AuthProvider>
  );
}

export default App;
