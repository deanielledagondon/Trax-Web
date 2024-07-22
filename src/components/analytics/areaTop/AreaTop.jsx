import { MdOutlineMenu, MdPerson } from "react-icons/md";
import "./AreaTop.scss";
import { useContext, useState } from "react";
import { SidebarContext } from "../../../context/SidebarContext";
import InputBase from "@mui/material/InputBase";
import { Box, IconButton, useTheme } from "@mui/material";
import { MdOutlineSearch } from "react-icons/md";

const TopArea = () => {
  const { openSidebar } = useContext(SidebarContext);
  const [searchQuery, setSearchQuery] = useState("");
  const theme = useTheme();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // Implement search logic here if needed
  };

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
        <h2 className="area-top-title">Perfomance Analytics</h2>
      </div>
      <div className="area-top-r">
        <Box
          display="flex"
          justifyContent="space-between"
          p={2}
          sx={{ width: "250px" }} // Adjust width here
        >
          {/* SEARCH BAR */}
          <Box
            display="flex"
            backgroundColor={theme.palette.mode === 'dark' ? "#3f51b5" : "white"}
            borderRadius="10px"
            border={theme.palette.mode === 'dark' ? "1px solid white" : "1px solid black"}
            sx={{ width: "100%" }}
          >
            <InputBase
              placeholder="Search"
              sx={{ ml: 2, flex: 1, color: theme.palette.mode === 'dark' ? "white" : "black" }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <IconButton type="button" sx={{ p: 1, color: theme.palette.mode === 'dark' ? "white" : "#3f51b5" }}>
              <MdOutlineSearch />
            </IconButton>
          </Box>
        </Box>
      </div>
    </section>
  );
};

export default TopArea;
