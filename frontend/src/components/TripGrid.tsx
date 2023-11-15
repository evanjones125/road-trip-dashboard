import React from 'react';
import TripGridItem from './TripGridItem';
import TripForm from './TripForm';
import type { Trip, TripGridProps } from '../types/types';

// create a <li> for each Trip in the trips array
const TripGrid: React.FC<TripGridProps> = ({ trips }) => {
  return (
    <>
      <h1 className="welcome-text">
        {trips.length > 0
          ? "Welcome to your trip dashboard! Here's a list of your upcoming trips:"
          : "You don't have any trips planned. Create one below!"}
      </h1>
      <div className="trips-container">
        {trips.map((trip: Trip, i: number) => {
          return (
            <div className="trip-card" key={i}>
              <TripGridItem trip={trip} getWeather={() => 1} />
            </div>
          );
        })}
        <TripForm />
      </div>
    </>
  );
};

export default TripGrid;
