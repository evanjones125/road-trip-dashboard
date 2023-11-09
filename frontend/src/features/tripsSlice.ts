import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Trip } from '../types/types';
import { BASE_URL } from '../constants/constants';

export type TripsState = {
  trips: Trip[];
};

const initialState: TripsState = {
  trips: [],
};

export const fetchTrips = createAsyncThunk('trips/fetchTrips', async () => {
  const response = await fetch(`${BASE_URL}/trips/`).then((response) => {
    return response;
  });

  return response.json();
});

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

// export const tripsSlice = createSlice({
//   name: 'trips',
//   initialState,
//   reducers: {
//     setTrips: (state, action: PayloadAction<Trip[]>) => {
//       state.trips = action.payload;
//     },
//     addTrip: (state, action: PayloadAction<Trip>) => {
//       state.trips.push(action.payload);
//     },
//   },
// });
