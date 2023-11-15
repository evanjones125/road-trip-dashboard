import React, { useEffect } from 'react';
import LocationGridItem from './LocationGridItem';
import LocationForm from './LocationForm';
import type { LocationWithCameras, LocationGridProps } from '../types/types';

import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTrip, fetchTrips } from '../features/tripsSlice';
import { refreshSession } from '../features/authSlice';
import type { AppDispatch, RootState } from '../store';
import { useParams } from 'react-router-dom';

// create a <li> for each Trip in the trips array
const LocationGrid: React.FC<LocationGridProps> = ({ locations }) => {
  const { tripId } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const { id } = useSelector((state: RootState) => state.auth);
  const { currentTripName } = useSelector((state: RootState) => state.trips);
  const token: string | null = localStorage.getItem('token');

  useEffect(() => {
    if (token && id) {
      const initialize = async () => {
        await dispatch(refreshSession(token));
        await dispatch(fetchTrips(id));
        dispatch(setCurrentTrip(Number(tripId)));
      };
      initialize();
    }
  }, [dispatch, tripId, id, token]);

  return (
    <>
      <h1 className="welcome-text">
        {currentTripName
          ? `Location list for ${currentTripName}`
          : "You don't have any locations entered for this trip. Add one below!"}
      </h1>
      <div className="trips-container">
        {locations.map((location: LocationWithCameras, i: number) => {
          return (
            <div className="trip-card" key={i}>
              <LocationGridItem location={location} />
            </div>
          );
        })}
        <LocationForm />
      </div>
    </>
  );
};

export default LocationGrid;
