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
const LocationGrid: React.FC<LocationGridProps> = ({
  locations,
  onBackButtonClick,
}) => {
  const { tripId } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const { id } = useSelector((state: RootState) => state.auth);
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
    <div className="trips-container">
      {locations.map((location: LocationWithCameras, i: number) => {
        return (
          <div className="trip-card" key={i}>
            <LocationGridItem
              location={location}
              onBackButtonClick={onBackButtonClick}
            />
          </div>
        );
      })}
      <LocationForm />
    </div>
  );
};

export default LocationGrid;
