import React from 'react';
import LocationGridItem from './LocationGridItem';
import type { LocationWithCameras, LocationGridProps } from '../types/types';

// create a <li> for each Trip in the trips array
const TripGrid: React.FC<LocationGridProps> = ({
  locations,
  onBackButtonClick,
}) => {
  if (locations === null) {
    return <div className="locations-container">error</div>;
  }

  return (
    <div className="locations-container">
      {locations.map((location: LocationWithCameras, i: number) => {
        return (
          <div className="location-card" key={i}>
            <LocationGridItem
              location={location}
              onBackButtonClick={onBackButtonClick}
            />
          </div>
        );
      })}
      {/* <TripForm onSubmit={addTrip} /> */}
      locations
    </div>
  );
};

export default TripGrid;
