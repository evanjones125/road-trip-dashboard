import React from 'react';
import type { TripProps } from '../types/types';

const Trip = (props: TripProps) => {
  const { location, date, camera } = props;

  return (
    <div>
      {`location: ${location}; date: ${date}`}
      <img src={camera} alt="gif of live camera" />
    </div>
  );
};

export default Trip;
