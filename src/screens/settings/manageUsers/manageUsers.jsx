import React, { useState, useEffect } from 'react';
import { Box, InputBase, IconButton, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem } from '@mui/material';
import { MdOutlineSearch, MdEditSquare, MdDeleteForever } from 'react-icons/md';
import { supabase } from '../../../components/helper/supabaseClient';
import './manageUsers.scss';

const ManageUsers = () => {
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });

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

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.full_name,
      email: user.email,
      password: '',  // Presume we handle password differently
      role: user.role,
    });
    setOpenEdit(true);
  };

  const handleAddClick = () => {
    setFormData({ name: '', email: '', password: '', role: '' });
    setOpenAdd(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedUser(null);
    setFormData({ name: '', email: '', password: '', role: '' });
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    setFormData({ name: '', email: '', password: '', role: '' });
  };

  const handleSaveEdit = () => {
    // Implement save functionality here for editing a user
    handleCloseEdit();
  };

  const handleSaveAdd = () => {
    // Implement save functionality here for adding a new user
    handleCloseAdd();
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <IconButton aria-label="edit" className="edit-icon" onClick={() => handleEditClick(user)}>
                    <MdEditSquare />
                  </IconButton>
                  <IconButton aria-label="delete" className="delete-icon">
                    <MdDeleteForever />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        className="custom-dialog"
        PaperProps={{
          sx: {
            width: '500px',
            padding: '20px',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: '1.5rem',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          Edit User
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ marginBottom: '20px', fontSize: '1rem', fontFamily: 'Arial', fontWeight: 'normal' }}
          />
          <TextField
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ marginBottom: '20px', fontSize: '1rem', fontFamily: 'Arial', fontWeight: 'normal' }}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            sx={{ marginBottom: '20px', fontSize: '1rem', fontFamily: 'Arial', fontWeight: 'normal' }}
          />
          <Select
            margin="dense"
            fullWidth
            displayEmpty
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            sx={{ marginBottom: '20px', fontSize: '1rem', fontFamily: 'Arial', fontWeight: 'normal' }}
          >
            <MenuItem value="" disabled>Select Role</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Staff">Staff</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions className="MuiDialogActions-root" sx={{ justifyContent: 'center' }}>
          <Button onClick={handleSaveEdit} color="primary" variant="contained" sx={{ marginRight: '10px' }}>SAVE</Button>
          <Button onClick={handleCloseEdit} color="error" variant="contained">CANCEL</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAdd}
        onClose={handleCloseAdd}
        className="custom-dialog"
        PaperProps={{
          sx: {
            width: '500px',
            padding: '20px',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: '1.5rem',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          Add New User
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ marginBottom: '20px', fontSize: '1rem', fontFamily: 'Arial', fontWeight: 'normal' }}
          />
          <TextField
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ marginBottom: '20px', fontSize: '1rem', fontFamily: 'Arial', fontWeight: 'normal' }}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            sx={{ marginBottom: '20px', fontSize: '1rem', fontFamily: 'Arial', fontWeight: 'normal' }}
          />
          <Select
            margin="dense"
            fullWidth
            displayEmpty
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            sx={{ marginBottom: '20px', fontSize: '1rem', fontFamily: 'Arial', fontWeight: 'normal' }}
          >
            <MenuItem value="" disabled>Select Role</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Staff">Staff</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions className="MuiDialogActions-root" sx={{ justifyContent: 'center' }}>
          <Button onClick={handleSaveAdd} color="primary" variant="contained" sx={{ marginRight: '10px' }}>SAVE</Button>
          <Button onClick={handleCloseAdd} color="error" variant="contained">CANCEL</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageUsers;
