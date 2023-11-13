import React from 'react';
import TripGridItem from './TripGridItem';
import TripForm from './TripForm';
import getWeatherData from '../App';
import type { Trip, TripGridProps } from '../types/types';
import type { RootState } from '../store';
import { useSelector } from 'react-redux';

// create a <li> for each Trip in the trips array
const TripGrid: React.FC<TripGridProps> = ({
  trips,
  addTrip,
  deleteTrip,
  onLocationButtonClick,
}) => {
  // const { trips: tripsRedux } = useSelector((state: RootState) => state.trips);
  // console.log(tripsRedux);

  return (
    <div className="trips-container">
      {trips.map((trip: Trip, i: number) => {
        return (
          <div className="trip-card" key={i}>
            <TripGridItem
              trip={trip}
              deleteTrip={deleteTrip}
              onLocationButtonClick={onLocationButtonClick}
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
