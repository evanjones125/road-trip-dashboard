import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { refreshSession } from '../features/authSlice';
import {
  fetchTrips,
  setCurrentTrip,
  setCurrentLocation,
} from '../features/tripsSlice';

const LocationDetailView = () => {
  const { tripId, locationId } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const { id } = useSelector((state: RootState) => state.auth);
  const { selectedLocation } = useSelector((state: RootState) => state.trips);
  const token: string | null = localStorage.getItem('token');

  useEffect(() => {
    if (token && id) {
      const initialize = async () => {
        await dispatch(refreshSession(token));
        await dispatch(fetchTrips(id));
        await dispatch(setCurrentTrip(Number(tripId)));
        dispatch(setCurrentLocation(Number(locationId)));
      };
      initialize();
    }
  }, [dispatch, tripId, id, token, locationId]);

  return (
    <div>
      <h1 className="welcome-text">LocationDetailView</h1>
      <iframe
        title="map"
        width="600"
        height="450"
        // style="border:0"
        loading="lazy"
        // allowfullscreen
        src={`https://www.google.com/maps/embed/v1/place?key=${null}&q=${
          selectedLocation?.latitude
        },${selectedLocation?.longitude}`}
      ></iframe>
      <a href={`/dashboard/locations/${tripId}`}>Back to LocationGrid</a>
    </div>
  );
};

export default LocationDetailView;
