import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { InputEvent } from '../types/types';
import { userSignup } from '../features/authSlice';
import type { User } from '../features/authSlice';
import type { AppDispatch } from '../store';

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
      <div className="signup-container">
        <h1>Signup</h1>
        <form onSubmit={handleSignup}>
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
          <button type="submit">Signup</button>
        </form>
      </div>

      <div className="login-link">
        <p>
          Already have an account? <Link to="/login">Log in here</Link>
        </p>
      </div>
    </>
  );
};

export default Signup;
