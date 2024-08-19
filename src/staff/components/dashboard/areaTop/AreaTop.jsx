import { MdOutlineMenu, MdPerson } from "react-icons/md";
import "./AreaTop.scss";
import { useContext } from "react";
import { SidebarContext } from "../../../context/SidebarContext";

const AreaTop = () => {
  const { openSidebar } = useContext(SidebarContext);

  return (
    <section className="content-area-top">
      <div className="area-top-l">
        <button
          className="sidebar-open-btn"
          type="button"
          onClick={openSidebar}
        >
          <MdOutlineMenu size={24} />
        </button>
        <h2 className="area-top-title">Dashboard</h2>
      </div>
      <div className="area-top-r">
        {/* You can add other components or elements here if needed */}
      </div>
    </section>
  );
};

export default AreaTop;
