import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { InputEvent } from '../types/types';
import { userSignup } from '../features/authSlice';
import type { User } from '../features/authSlice';
import type { AppDispatch } from '../store';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  ThemeProvider,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';

const Signup = () => {
  const [credentials, setCredentials] = useState<User>({
    username: '',
    password: '',
  });
  const { username, password } = credentials;

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(userSignup(credentials));
    navigate('/login');
  };

  const handleChange = (e: InputEvent) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <>
      <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h2" component="h2">
              Sign Up
            </Typography>
            <Box component="form" onSubmit={handleSignup}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                name="username"
                label="Username"
                variant="outlined"
                value={username}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                name="password"
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Link to="/login">Already have an account? sign in here</Link>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default Signup;
