import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userLogin } from '../features/authSlice';
import type { InputEvent } from '../types/types';
import type { RootState } from '../store';

const Login = () => {
  const { success } = useSelector((state: RootState) => state.auth);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const { username, password } = credentials;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // wait until user is successfully logged in before navigating to dashboard
  useEffect(() => {
    if (success) {
      navigate('/dashboard');
    }
  }, [navigate, success]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(userLogin(credentials));
  };

  const handleChange = (e: InputEvent) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <>
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={handleChange}
          />
          <button type="submit">Login</button>
        </form>
      </div>

      <div className="signup-link">
        <p>
          Don&apos;t have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </>
  );
};

export default Login;
