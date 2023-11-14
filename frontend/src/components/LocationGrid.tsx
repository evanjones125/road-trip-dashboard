import React from 'react';
import LocationGridItem from './LocationGridItem';
import LocationForm from './LocationForm';
import type { LocationWithCameras, LocationGridProps } from '../types/types';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';

// create a <li> for each Trip in the trips array
const LocationGrid: React.FC<LocationGridProps> = ({
  locations,
  // deleteLocation,
  onBackButtonClick,
  tripId,
  userId,
}) => {
  const { currentLocations } = useSelector((state: RootState) => state.trips);

  return (
    <div className="trips-container">
      {currentLocations.map((location: LocationWithCameras, i: number) => {
        return (
          <div className="trip-card" key={i}>
            <LocationGridItem
              location={location}
              onBackButtonClick={onBackButtonClick}
              // deleteLocation={deleteLocation}
            />
          </div>
        );
      })}
      <LocationForm />
    </div>
  );
};

export default LocationGrid;
