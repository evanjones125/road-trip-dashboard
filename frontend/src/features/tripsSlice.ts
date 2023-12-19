import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Trip,
  Location,
  LocationWithCameras,
  FormData,
  TripFormData,
} from '../types/types';
import { handleAxiosError } from '../utils/errorHandling';
import { BASE_URL } from '../constants/constants';
import { RootState } from '../store';

export type TripsState = {
  trips: Trip[];
  locationsOfCurrentTrip: LocationWithCameras[];
  selectedLocation: LocationWithCameras | null;
  currentTripId?: number | null;
  currentTripName?: string | null;
};

const initialState: TripsState = {
  trips: [],
  locationsOfCurrentTrip: [],
  selectedLocation: null,
  currentTripId: null,
  currentTripName: null,
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

export const deleteTrip = createAsyncThunk<any, any>(
  'trips/deleteTrip',
  async (tripId: number) => {
    try {
      await axios.delete(`${BASE_URL}/trips/${tripId}/`);
      return tripId;
    } catch (error) {
      handleAxiosError(error);
    }
  }
);

export const addLocation = createAsyncThunk<LocationWithCameras, FormData>(
  'trips/addLocation',
  async (location: FormData, { getState }) => {
    const currentTripId = (getState() as RootState).trips.currentTripId;
    const { locationName, latitude, longitude, dateRange } = location;

    try {
      const response = await axios
        .post(`${BASE_URL}/trips/${currentTripId}/add_location/`, {
          location_name: locationName,
          latitude: latitude,
          longitude: longitude,
          start_date: dateRange[0],
          end_date: dateRange[1],
          trip: currentTripId,
        })
        .then((response) => {
          return response;
        });

      const cameraObject = await axios
        .get(
          `${BASE_URL}/api/getCamera/closestCamera/${latitude},${longitude}/`
        )
        .then((response) => {
          return response;
        });

      return { ...response.data, camera: cameraObject.data.camera_obj };
    } catch (error) {
      handleAxiosError(error);
    }
  }
);

export const deleteLocation = createAsyncThunk<any, any>(
  'trips/deleteLocation',
  async (locationId: number) => {
    try {
      await axios.delete(`${BASE_URL}/locations/${locationId}/`);
      return locationId;
    } catch (error) {
      handleAxiosError(error);
    }
  }
);

// takes in a trip id and sets it as the current trip and sets the current locations array to the locations of that trip
export const setCurrentTrip = createAsyncThunk<
  LocationWithCameras[] | number,
  number
>('trips/setCurrentTrip', async (tripId: number, { getState }) => {
  const trips: Trip[] = (getState() as RootState).trips.trips;

  const locations: Location[] = trips
    .map((trip: Trip) => trip.locations)
    .flat()
    .filter((location: Location) => location.trip === tripId);

  if (locations.length === 0) {
    return tripId;
  }

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
});

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    clearLocations: (state) => {
      state.locationsOfCurrentTrip = [];
    },
    setCurrentLocation: (state, action: PayloadAction<number>) => {
      const locationId = action.payload;

      const location = state.locationsOfCurrentTrip.find(
        (location) => location.id === locationId
      );

      state.selectedLocation = location ? location : null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTrips.fulfilled, (state, action) => {
      state.trips = action.payload;
    });
    builder.addCase(addTrip.fulfilled, (state, action: PayloadAction<Trip>) => {
      state.trips.push(action.payload);
    });
    builder.addCase(setCurrentTrip.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        state.locationsOfCurrentTrip = action.payload;
        state.currentTripId = state.locationsOfCurrentTrip[0].trip;
        state.currentTripName = state.trips.find(
          (trip) => trip.id === state.currentTripId
        )?.trip_name;
      } else {
        state.locationsOfCurrentTrip = [];
        state.currentTripId = action.payload;
        state.currentTripName = state.trips.find(
          (trip) => trip.id === state.currentTripId
        )?.trip_name;
      }
    });
    builder.addCase(
      addLocation.fulfilled,
      (state, action: PayloadAction<LocationWithCameras>) => {
        state.locationsOfCurrentTrip.push(action.payload);
      }
    );
    builder.addCase(
      deleteTrip.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.trips = state.trips.filter((trip) => trip.id !== action.payload);
      }
    );
    builder.addCase(
      deleteLocation.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.locationsOfCurrentTrip = state.locationsOfCurrentTrip.filter(
          (location) => location.id !== action.payload
        );
      }
    );
  },
});

export const tripsReducer = tripsSlice.reducer;
export const { setCurrentLocation, clearLocations } = tripsSlice.actions;
export default tripsSlice;
