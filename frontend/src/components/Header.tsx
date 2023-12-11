import * as React from 'react';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="header">
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <a
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
              href="/dashboard/trips"
            >
              <p>Trip Dashboard</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 256 256"
              >
                <path
                  fill="currentColor"
                  d="m254.07 114.79l-45.54-53.06A16 16 0 0 0 196.26 56H32a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h17a32 32 0 0 0 62 0h50a32 32 0 0 0 62 0h17a16 16 0 0 0 16-16v-64a8 8 0 0 0-1.93-5.21ZM32 112V72h56v40Zm48 96a16 16 0 1 1 16-16a16 16 0 0 1-16 16Zm80-96h-56V72h56Zm32 96a16 16 0 1 1 16-16a16 16 0 0 1-16 16Zm-16-96V72h20.26l34.33 40Z"
                />
              </svg>
            </a>
          </Typography>
          <Button onClick={handleLogout} color="inherit">
            Log out
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
