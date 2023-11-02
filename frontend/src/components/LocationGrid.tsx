import React from 'react';
import LocationGridItem from './LocationGridItem';
import LocationForm from './LocationForm';
import type { LocationWithCameras, LocationGridProps } from '../types/types';

// create a <li> for each Trip in the trips array
const TripGrid: React.FC<LocationGridProps> = ({
  locations,
  addLocation,
  onBackButtonClick,
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
            />
          </div>
        );
      })}
      <LocationForm onSubmit={addLocation} />
    </div>
  );
};

export default TripGrid;
