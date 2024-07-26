import React, { useState, useEffect } from 'react';
import { Box, InputBase, IconButton, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { MdOutlineSearch, MdEdit, MdDelete } from 'react-icons/md';
import { supabase } from '../../../components/helper/supabaseClient';
import './manageUsers.scss';

const ManageUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from('registrants').select('full_name, email, role');
        if (error) {
          console.error('Error fetching users:', error);
        } else {
          setUsers(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="manage-users">
      <div className="header">
        <h1>Manage Users</h1>
        <Box
          display="flex"
          backgroundColor={theme.palette.mode === 'dark' ? "#3f51b5" : "white"}
          borderRadius="10px"
          border={theme.palette.mode === 'dark' ? "1px solid white" : "1px solid black"}
          sx={{ width: "100%", maxWidth: "300px", marginLeft: "auto", visibility: "visible" }}
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
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email Address</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.email}>
                <TableCell component="th" scope="row">
                  {user.full_name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton aria-label="edit" className="edit-icon">
                    <MdEdit />  
                  </IconButton>
                  <IconButton aria-label="delete" className="delete-icon">
                    <MdDelete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ManageUsers;
