import React, { useState, useEffect } from 'react';
import { Box, InputBase, IconButton, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem } from '@mui/material';
import { MdOutlineSearch, MdEditSquare, MdDeleteForever } from 'react-icons/md';
import { supabase, supabaseAdmin } from '../../../components/helper/supabaseClient';
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
    setSearchQuery(event.target.value);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.full_name,
      email: user.email,
      password: '', // Presume we handle password differently
      confirmPassword: '',
      role: user.role,
      window_no: user.window_no,
    });
    setOpenEdit(true);
  };

  const handleAddClick = () => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '', role: '', window_no: '' });
    setOpenAdd(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedUser(null);
    setFormData({ name: '', email: '', password: '', confirmPassword: '', role: '', window_no: '' });
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    setFormData({ name: '', email: '', password: '', confirmPassword: '', role: '', window_no: '' });
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
    setUserToDelete(null);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setOpenConfirmDelete(true);
  };

  const handleSaveEdit = async () => {    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
  } else if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
  } else {
      const { data: user, error } = await supabaseAdmin.auth.admin.updateUserById(
          selectedUser.id,
          { password: formData.password }
      );
  
      if (error) {
          console.error('Error updating password:', error);
      } else {
          console.log('Password updated successfully');
      }
  }
  

    if (selectedUser.email !== formData.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (!emailPattern.test(formData.email)) {
          console.log("Invalid email format.");
          alert("Invalid email format.");
          return;
      } else {
          console.log("Email format is valid.");
          const { data: user, error } = await supabaseAdmin.auth.admin.updateUserById(
            selectedUser.id,
            { email: formData.email }
          )
      }
  }
  


    try {
      const { data, error } = await supabase
        .from('registrants')
        .update({
          full_name: formData.name,
          email: formData.email,
          role: formData.role,
          window_no: formData.window_no
        })
        .eq('id', selectedUser.id);

      if (error) {
        console.error('Error updating user:', error);
      } else {
        const updatedUsers = users.map(user =>
          user.id === selectedUser.id ? { ...user, ...formData } : user
        );
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }

    handleCloseEdit();
  };

  const handleSaveAdd = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Invalid email format');
      return;
    }
  
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: { 
          sub: '11111111-1111-1111-1111-111111111111',
          email: formData.email,
          full_name: formData.name,
          email_verified: true,
          phone_verified: false
        }
      });
  
      if (authError) {
        console.error('Error signing up user:', authError);
      } else {
        if (authData.user.id) {
          const { data: user, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            authData.user.id,
            { user_metadata: { sub: authData.user.id } }
          );
  
          if (updateError) {
            console.error('Error updating user metadata:', updateError);
          }
        }
  
        const { data, error } = await supabase
          .from('registrants')
          .insert({
            id: authData.user.id,
            full_name: formData.name,
            email: formData.email,
            role: formData.role,
            window_no: formData.window_no,
          });
  
        if (error) {
          console.error('Error adding user to registrants table:', error);
        } else {
          setUsers([...users, { ...formData, email: formData.email }]);
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  
    handleCloseAdd();
  };
  


  const handleDelete = async () => {
    if (userToDelete) {
      try {
        // Delete user from Supabase Auth
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userToDelete.id);

        if (authError) {
          console.error('Error deleting user from Supabase Auth:', authError);
          alert('Failed to delete user from authentication system.');
          return;
        }

        // Delete user from registrants table
        const { data: deleteData, error: deleteError } = await supabase
          .from('registrants')
          .delete()
          .eq('id', userToDelete.id);

        if (deleteError) {
          console.error('Error deleting user from registrants table:', deleteError);
          alert('Failed to delete user from registrants table.');
          return;
        }

        // Update the local user list
        const updatedUsers = users.filter(user => user.id !== userToDelete.id);
        setUsers(updatedUsers);

        alert('User successfully deleted.');
      } catch (error) {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred.');
      }

      handleCloseConfirmDelete();
    }
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
              <TableCell>Window No.</TableCell>
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
                <TableCell>{user.window_no}</TableCell>
                <TableCell>
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
          <TextField
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            sx={{ marginBottom: '20px', fontSize: '1rem', fontFamily: 'Arial', fontWeight: 'normal' }}
          />
          <Select
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            fullWidth
            sx={{ marginBottom: '20px', fontSize: '1rem', fontFamily: 'Arial', fontWeight: 'normal' }}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Staff">Staff</MenuItem>
          </Select>
          <Select
            margin="dense"
            fullWidth
            displayEmpty
            value={formData.window_no}
            onChange={(e) => setFormData({ ...formData, window_no: e.target.value })}
            sx={{ marginBottom: '20px', fontSize: '1rem', fontFamily: 'Arial', fontWeight: 'normal' }}
          >
            <MenuItem value="" disabled>Select Window No.</MenuItem>
            <MenuItem value="W1">Window 1</MenuItem>
            <MenuItem value="W2">Window 2</MenuItem>
            <MenuItem value="W3">Window 3</MenuItem>
            <MenuItem value="W4">Window 4</MenuItem>
            <MenuItem value="W5">Window 5</MenuItem>
            <MenuItem value="W6">Window 6</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
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
          Add User
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
          <TextField
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            sx={{ marginBottom: '20px', fontSize: '1rem', fontFamily: 'Arial', fontWeight: 'normal' }}
          />
          <Select
            margin="dense"
            label="Role"
            displayEmpty
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            fullWidth
            sx={{ marginBottom: '20px', fontSize: '1rem', fontFamily: 'Arial', fontWeight: 'normal' }}
          >
            <MenuItem value="" disabled>Select Role</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Staff">Staff</MenuItem>
          </Select>
          <Select
            margin="dense"
            fullWidth
            displayEmpty
            value={formData.window_no}
            onChange={(e) => setFormData({ ...formData, window_no: e.target.value })}
            sx={{ marginBottom: '20px', fontSize: '1rem', fontFamily: 'Arial', fontWeight: 'normal' }}
          >
            <MenuItem value="" disabled>Select Window No.</MenuItem>
            <MenuItem value="W1">Window 1</MenuItem>
            <MenuItem value="W2">Window 2</MenuItem>
            <MenuItem value="W3">Window 3</MenuItem>
            <MenuItem value="W4">Window 4</MenuItem>
            <MenuItem value="W5">Window 5</MenuItem>
            <MenuItem value="W6">Window 6</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveAdd} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this user?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete}>Cancel</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageUsers;
