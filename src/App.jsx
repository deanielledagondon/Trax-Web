import React, { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import AdminLayout from "./layout/AdminLayout";
import Login from './screens/login/login';
// import Register from './screens/register/register';
import Queue from './screens/queue/queue';
import LogHistory from './screens/logbook/logHistory';
import Analytics from './screens/analytics/analytics';
import Feedback from './screens/feedback/feedback';


import Window1 from './components/Window1/Window1';
import HeaderStatss from "./components/window11/headerStatss";

import Window2 from "./components/Window2/Window2";
import HeaderStats2 from "./components/window22/headerStats2";

import Window3 from "./components/Window3/Window3";
import HeaderStats3 from "./components/window33/headerStats3";

import Window4 from "./components/Window4/Window4";
import HeaderStats4 from "./components/window44/headerStats4";

import Window5 from "./components/Window5/Window5";
import HeaderStats5 from "./components/window55/headerStats5";

import Window6 from "./components/Window6/Window6";
import HeaderStats6 from "./components/window66/headerStats6";

import HeaderStats from './components/feedback/headerStats/headerStats';


import { PageNotFound, Dashboard } from "./screens";
import ForgotPassword from "./screens/forgotPassword/forgotPassword";
import Settings from './screens/settings/settings'

import { AuthProvider } from './components/authContext';

import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";


import StaffLayout from "./staff/layout/StaffLayout";
import StaffDashboard from "./staff/screens/dashboard/DashboardScreen";
import StaffAnalytics from "./staff/screens/analytics/analytics";
import StaffFeedback from "./staff/screens/feedback/feedback";
import StaffLogHistory from "./staff/screens/logbook/logHistory";
import StaffQueue from "./staff/screens/queue/queue";
import StaffSettings from "./staff/screens/settings/settings";
import StaffPageNotFound from "./staff/screens/error/PageNotFound";




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
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route element={<AdminLayout />}>
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/queue" element={<Queue />} />
            <Route path="/logbook" element={<LogHistory />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/settings/*" element={<Settings />} />
            <Route path="*" element={<PageNotFound />} />


            <Route path="/headerStatss" element={<HeaderStatss />} />
            <Route path="/Window1" element={<Window1 />} />

            <Route path="/headerStats2" element={<HeaderStats2 />} />
            <Route path="/Window2" element={<Window2 />} />

            <Route path="/headerStats3" element={<HeaderStats3 />} />
            <Route path="/Window3" element={<Window3 />} />

            <Route path="/headerStats4" element={<HeaderStats4 />} />
            <Route path="/Window4" element={<Window4 />} />

            <Route path="/headerStats5" element={<HeaderStats5 />} />
            <Route path="/Window5" element={<Window5 />} />

            <Route path="/headerStats6" element={<HeaderStats6 />} />
            <Route path="/Window6" element={<Window6 />} />

            <Route path="headerStats" element={<HeaderStats/>} />

          </Route>
          
          <Route element={<StaffLayout />}>
            <Route path="/staff-dashboard" element={<StaffDashboard />} />
            <Route path="/staff-queue" element={<StaffQueue />} />
            <Route path="/staff-logbook" element={<StaffLogHistory />} />
            <Route path="/staff-analytics" element={<StaffAnalytics />} />
            <Route path="/staff-feedback" element={<StaffFeedback />} />
            <Route path="/staff-settings/*" element={<StaffSettings />} />
            <Route path="*" element={<StaffPageNotFound />} />
          </Route>
        </Routes>

        <ThemeToggleButton />
      </Router>
    </AuthProvider>
  );
}



export default App;
