import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Trip } from '../types/types';
import { handleAxiosError } from '../utils/errorHandling';
import { BASE_URL } from '../constants/constants';

export type TripsState = {
  trips: Trip[];
};

const initialState: TripsState = {
  trips: [],
};

export const fetchTrips = createAsyncThunk(
  'trips/fetchTrips',
  async (userId: number) => {
    try {
      const response = await axios
        .get(`${BASE_URL}/user/${userId}/trips/`)
        .then((response) => {
          return response;
        });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }
);

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    addTrip: (state, action: PayloadAction<Trip>) => {
      state.trips.push(action.payload);
    },
    removeTrip: (state) => state,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTrips.fulfilled, (state, action) => {
      state.trips = action.payload;
    });
  },
});

export const tripsReducer = tripsSlice.reducer;
export const { addTrip, removeTrip } = tripsSlice.actions;

export default tripsSlice;
