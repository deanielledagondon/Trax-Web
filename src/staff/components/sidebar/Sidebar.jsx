import { useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import {
  MdOutlineClose,
  MdOutlineBook,
  MdOutlineGroups,
  MdOutlineBarChart,
  MdOutlineComment,
  MdOutlineGridView,
  MdOutlineLogout,
  MdOutlineSettings,
  MdPerson,
} from "react-icons/md";
import { Link } from "react-router-dom";
import LogoDark from "../../assets/images/logo-dark-small.png";
import LogoLight from "../../assets/images/logo-light-small.png";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";
import { supabase } from "../helper/supabaseClient";

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  // Closing the sidebar when clicked outside
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      closeSidebar();
    }
  };

  useEffect(() => {
    const handleClick = (event) => {
      handleClickOutside(event);
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  // Function to handle logout
  const handleLogout = async () => {
    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);
    const { error } = await supabase
      .from("registrants")
      .update({ status: "Away" })
      .eq("id", parsedUser.id);
    localStorage.removeItem("sb-swqywqargpfwcyvpqhkn-auth-token");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("themeMode");
    window.location.href = "/";
  };

  // Function to check if the link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={sidebarRef}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src={theme === LIGHT_THEME ? LogoLight : LogoDark} alt="Logo" />
          <span className="sidebar-brand-text">TRAX</span>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
              <Link
                to="/staff-dashboard"
                className={`menu-link ${
                  isActive("/staff-dashboard") ? "active" : ""
                }`}
              >
                <span className="menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="menu-link-text">Dashboard</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/staff-queue"
                className={`menu-link ${
                  isActive("/staff-queue") ? "active" : ""
                }`}
              >
                <span className="menu-link-icon">
                  <MdOutlineGroups size={20} />
                </span>
                <span className="menu-link-text">Queue</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/staff-logbook"
                className={`menu-link ${
                  isActive("/staff-logbook") ? "active" : ""
                }`}
              >
                <span className="menu-link-icon">
                  <MdOutlineBook size={20} />
                </span>
                <span className="menu-link-text">Log History</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/staff-analytics"
                className={`menu-link ${
                  isActive("/staff-analytics") ? "active" : ""
                }`}
              >
                <span className="menu-link-icon">
                  <MdOutlineBarChart size={18} />
                </span>
                <span className="menu-link-text">Analytics</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/staff-feedback"
                className={`menu-link ${
                  isActive("/staff-feedback") ? "active" : ""
                }`}
              >
                <span className="menu-link-icon">
                  <MdOutlineComment size={20} />
                </span>
                <span className="menu-link-text">Feedback</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              <Link
                to="/staff-settings"
                className={`menu-link ${
                  isActive("/staff-settings") ? "active" : ""
                }`}
              >
                <span className="menu-link-icon">
                  <MdOutlineSettings size={20} />
                </span>
                <span className="menu-link-text">Settings</span>
              </Link>
            </li>
            <li className="menu-item" onClick={handleLogout}>
              <span className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineLogout size={20} />
                </span>
                <span className="menu-link-text">Logout</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
