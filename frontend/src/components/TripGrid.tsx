import React from 'react';
import TripGridItem from './TripGridItem';
import TripForm from './TripForm';
import type { Trip, TripGridProps } from '../types/types';

// create a <li> for each Trip in the trips array
const TripGrid: React.FC<TripGridProps> = ({
  trips,
  // deleteTrip,
  onLocationButtonClick,
}) => {
  return (
    <div className="trips-container">
      {trips.map((trip: Trip, i: number) => {
        return (
          <div className="trip-card" key={i}>
            <TripGridItem
              trip={trip}
              // deleteTrip={deleteTrip}
              onLocationButtonClick={onLocationButtonClick}
              getWeather={() => 1}
            />
          </div>
        );
      })}
      <TripForm />
    </div>
  );
};

export default TripGrid;
