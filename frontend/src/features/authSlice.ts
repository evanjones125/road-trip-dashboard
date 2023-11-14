import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../constants/constants';

type AuthState = {
  success: boolean;
  token: string | null;
  id?: number | null;
};

export type User = {
  username: string;
  password: string;
};

const initialState: AuthState = {
  success: false,
  token: null,
  id: null,
};

export const refreshSession = createAsyncThunk(
  'auth/refreshSession',
  async (token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/refresh/`, {
        headers: { 'Content-Type': 'application/json', Authorization: token },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const userLogin = createAsyncThunk('auth/Login', async (user: User) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/login/`, user, {
      headers: { 'Content-Type': 'application/json' },
    });
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const userSignup = createAsyncThunk(
  'auth/Signup',
  async (user: User) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/register/`, user, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.success = false;
      state.token = null;
      state.id = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.success = true;
      state.id = action.payload.id;
    });

    builder.addCase(refreshSession.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.success = true;
      state.id = action.payload.id;
    });
  },
});

export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions;

export default authSlice;
