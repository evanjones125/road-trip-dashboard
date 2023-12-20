import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userLogin } from '../features/authSlice';
import type { InputEvent } from '../types/types';
import type { RootState, AppDispatch } from '../store';
import type { User } from '../features/authSlice';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  ThemeProvider,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';

const Login = () => {
  const { success } = useSelector((state: RootState) => state.auth);
  const [credentials, setCredentials] = useState<User>({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { username, password } = credentials;

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  // wait until user is successfully logged in before navigating to dashboard
  useEffect(() => {
    if (success) {
      navigate('/dashboard/trips');
    }
  }, [navigate, success]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(userLogin(credentials));
  };

  const handleChange = (e: InputEvent) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({ ...prevState, [name]: value }));
  };

  if (isLoading)
    return (
      <div className="logging-in-message">
        <h1>Logging in...</h1>
        <h2>
          I&#39;m using the free tier of my backend hosting service so sometimes
          it takes 10-15 seconds to warm up
        </h2>
      </div>
    );

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
              Login
            </Typography>
            <Box component="form" onSubmit={handleLogin}>
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
                Sign In
              </Button>
              <Link to="/signup">Don&apos;t have an account? Sign up here</Link>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default Login;
