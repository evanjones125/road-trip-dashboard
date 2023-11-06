import React from 'react';
import LocationGridItem from './LocationGridItem';
import LocationForm from './LocationForm';
import type { LocationWithCameras, LocationGridProps } from '../types/types';

// create a <li> for each Trip in the trips array
const TripGrid: React.FC<LocationGridProps> = ({
  locations,
  addLocation,
  deleteLocation,
  onBackButtonClick,
  tripId,
  userId,
}) => {
  if (locations === null) {
    return <div className="locations-container">error</div>;
  }

  return (
    <div className="trips-container">
      {locations.map((location: LocationWithCameras, i: number) => {
        return (
          <div className="trip-card" key={i}>
            <LocationGridItem
              location={location}
              onBackButtonClick={onBackButtonClick}
              deleteLocation={deleteLocation}
            />
          </div>
        );
      })}
      <LocationForm onSubmit={addLocation} />
    </div>
  );
};

export default TripGrid;
