import React, { useEffect } from 'react';
import WeatherDisplay from './WeatherDisplay';
import AstronomyDisplay from './AstronomyDisplay';
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
  const mapsAPIKey = import.meta.env.VITE_GOOGLEMAPS_API_KEY;

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
    <>
      <h1 className="welcome-text">
        Detailed view for {selectedLocation?.location_name}{' '}
        {selectedLocation?.start_date} - {selectedLocation?.end_date}
      </h1>
      <a
        className="location-detail-view-back-button"
        href={`/dashboard/locations/${tripId}`}
      >
        Back to LocationGrid
      </a>

      <div className="location-detail-view-container">
        <div className="location-detail-view-map">
          <h1>Map</h1>
          <iframe
            title="map"
            width="350"
            height="350"
            loading="lazy"
            src={`https://www.google.com/maps/embed/v1/place?key=${mapsAPIKey}&q=${selectedLocation?.latitude},${selectedLocation?.longitude}`}
          ></iframe>
        </div>
        <WeatherDisplay />
        <AstronomyDisplay />
      </div>
    </>
  );
};

export default LocationDetailView;
