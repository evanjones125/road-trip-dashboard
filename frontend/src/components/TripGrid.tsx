import React from 'react';
import TripGridItem from './TripGridItem';
import TripForm from './TripForm';
import getWeatherData from '../App';
import type { Trip, TripGridProps } from '../types/types';

// create a <li> for each Trip in the trips array
const TripGrid: React.FC<TripGridProps> = ({ trips, addTrip, deleteTrip }) => {
  return (
    <div className="trips-container">
      {trips.map((trip: Trip, i: number) => {
        const { id, trip_name, start_date, end_date } = trip;

        return (
          <div className="trip-card" key={i}>
            <TripGridItem
              id={id}
              tripName={trip_name}
              startDate={start_date}
              endDate={end_date}
              deleteTrip={deleteTrip}
              getWeather={getWeatherData}
            />
          </div>
        );
      })}
      <TripForm onSubmit={addTrip} />
    </div>
  );
};

export default TripGrid;
