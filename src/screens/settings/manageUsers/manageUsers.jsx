import React, { useState, useEffect } from 'react';
import { Box, InputBase, IconButton, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem } from '@mui/material';
import { MdOutlineSearch, MdEditSquare, MdDeleteForever } from 'react-icons/md';
import { supabase, supabaseAdmin } from '../../../components/helper/supabaseClient';
import { MdVisibility, MdVisibilityOff, MdCheckCircle, MdCancel } from "react-icons/md";

import './manageUsers.scss';

const ManageUsers = () => {
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [window_no, setWindowNo] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: '', window_no: '' });
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from('registrants').select();
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
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
        name: user.full_name,
        email: user.email,
        password: '',
        confirmPassword: '',
        role: user.role,
        window_no: user.window_no,
    });
    setPasswordMatch(false);
    setOpenEdit(true);
  };

  const handleAddClick = () => {
      setFormData({ name: '', email: '', password: '', confirmPassword: '', role: '', window_no: '' });
      setPasswordMatch(false);
      setOpenAdd(true);
  };

  // (Rest of your component code, including save, delete, and other handlers)

  const filteredUsers = users.filter(user => {
    const nameMatch = user.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = user.role.toLowerCase().includes(searchQuery.toLowerCase());
    const windowNoMatch = user.window_no && user.window_no.toString().toLowerCase().includes(searchQuery.toLowerCase());
  
    return nameMatch || emailMatch || roleMatch || windowNoMatch;
  });
  

  return (
    <div className="manage-users">
      <div className="header">
        <Button
          variant="contained"
          color="success"
          onClick={handleAddClick}
          sx={{ fontSize: '1rem', fontFamily: 'Arial', fontWeight: 'bold' }}
        >
          ADD USER
        </Button>
        <Box
          display="flex"
          backgroundColor={theme.palette.mode === 'dark' ? "#3f51b5" : "white"}
          borderRadius="10px"
          border={theme.palette.mode === 'dark' ? "2px solid white" : "1px solid black"}
          sx={{ width: "100%", maxWidth: "200px", marginLeft: "auto", visibility: "visible" }}
        >
          <InputBase
            placeholder="Search"
            sx={{ ml: 2, flex: 1, color: theme.palette.mode === 'dark' ? "white" : "black" }}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <IconButton type="button" sx={{ p: 1, color: theme.palette.mode === 'dark' ? "#3f51b5" : "white" }}>
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
            <TableCell align="center">Role</TableCell>
            <TableCell align="center">Window No.</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.email}>
                <TableCell component="th" scope="row">
                  {user.full_name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="center">{user.role}</TableCell>
                <TableCell align="center">{user.window_no}</TableCell>
                <TableCell align="center">
                  <IconButton aria-label="edit" className="edit-icon" onClick={() => handleEditClick(user)}>
                    <MdEditSquare />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(user)}>
                    <MdDeleteForever />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Dialog components for Edit, Add, and Delete */}
    </div>
  );
};

export default ManageUsers;
