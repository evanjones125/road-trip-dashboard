import React, { useEffect, useState } from 'react';
import LocationGridItem from './LocationGridItem';
import LocationForm from './LocationForm';
import type { LocationWithCameras, LocationGridProps } from '../types/types';

import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTrip, fetchTrips } from '../features/tripsSlice';
import { refreshSession } from '../features/authSlice';
import type { AppDispatch, RootState } from '../store';
import { useParams, useNavigate } from 'react-router-dom';

// create a <li> for each Trip in the trips array
const LocationGrid: React.FC<LocationGridProps> = ({ locations }) => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { id } = useSelector((state: RootState) => state.auth);
  const { currentTripName } = useSelector((state: RootState) => state.trips);
  const token: string | null = localStorage.getItem('token');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token && id) {
      const initialize = async () => {
        setIsLoading(true);
        await dispatch(refreshSession(token));
        await dispatch(fetchTrips(id));
        dispatch(setCurrentTrip(Number(tripId)));
        setIsLoading(false);
      };
      initialize();
    }
  }, [dispatch, tripId, id, token]);

  if (isLoading) return <h1>Fetching locations...</h1>;

  return (
    <>
      <h1 className="welcome-text">
        {currentTripName
          ? `Location list for ${currentTripName}`
          : "You don't have any locations entered for this trip. Add one below!"}
      </h1>
      <button
        className="location-detail-view-back-button"
        onClick={() => navigate('/dashboard/trips')}
      >
        Back to trips
      </button>

      <div className="locations-container">
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
