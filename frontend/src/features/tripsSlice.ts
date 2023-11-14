import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Trip,
  Location,
  LocationWithCameras,
  TripFormData,
} from '../types/types';
import { handleAxiosError } from '../utils/errorHandling';
import { BASE_URL } from '../constants/constants';
import { RootState } from '../store';

export type TripsState = {
  trips: Trip[];
  currentLocations: LocationWithCameras[];
  // currentTrip?: number | null;
};

const initialState: TripsState = {
  trips: [],
  currentLocations: [],
  // currentTrip: null,
};

export const fetchTrips = createAsyncThunk<Trip[], number>(
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

export const addTrip = createAsyncThunk<Trip, TripFormData>(
  'trips/addTrip',
  async (trip: TripFormData) => {
    const { tripName, startDate, endDate, user } = trip;

    try {
      const response = await axios
        .post(`${BASE_URL}/trips/`, {
          trip_name: tripName,
          start_date: startDate,
          end_date: endDate,
          user: user,
        })
        .then((response) => {
          return response;
        });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }
);

// takes in a trip id and sets it as the current trip and sets the current locations array to the locations of that trip
export const setCurrentTrip = createAsyncThunk<LocationWithCameras[], number>(
  'trips/setCurrentTrip',
  async (tripId: number, { getState }) => {
    const trips: Trip[] = (getState() as RootState).trips.trips;

    const locations: Location[] = trips
      .map((trip: Trip) => trip.locations)
      .flat()
      .filter((location: Location) => location.trip === tripId);

    const updatedLocations = [];

    for (const location of locations) {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/getCamera/closestCamera/${location.latitude},${location.longitude}/`
        );

        const updatedLocation = {
          ...location,
          camera: response.data.camera_obj,
        };

        updatedLocations.push(updatedLocation);
      } catch (error) {
        handleAxiosError(error);
      }
    }

    return updatedLocations;
  }
);

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    removeTrip: (state) => state,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTrips.fulfilled, (state, action) => {
      state.trips = action.payload;
    });
    builder.addCase(addTrip.fulfilled, (state, action: PayloadAction<Trip>) => {
      state.trips.push(action.payload);
    });
    builder.addCase(setCurrentTrip.fulfilled, (state, action) => {
      state.currentLocations = action.payload;
    });
  },
});

export const tripsReducer = tripsSlice.reducer;
export const { removeTrip } = tripsSlice.actions;

export default tripsSlice;
