import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const Profile = () => {
  // Sample user data
  const [user, setUser] = useState({
    name: "John Doe",
    username: "johndoe123",
    mobileNumber: "9876543210",
    email: "johndoe@example.com",
  });

  const [editMode, setEditMode] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Toggle edit mode
  const handleEdit = () => {
    setEditMode(!editMode);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Profile Details
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Full Name"
          name="name"
          value={user.name}
          onChange={handleChange}
          disabled={!editMode}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="username"
          value={user.username}
          disabled
        />
        <TextField
          fullWidth
          margin="normal"
          label="Mobile Number"
          name="mobileNumber"
          value={user.mobileNumber}
          onChange={handleChange}
          disabled={!editMode}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          value={user.email}
          onChange={handleChange}
          disabled={!editMode}
        />

        <Box mt={3} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color={editMode ? "primary" : "secondary"}
            onClick={handleEdit}
          >
            {editMode ? "Save" : "Edit"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
