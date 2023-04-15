import React from 'react';
import type { TripProps } from '../types/types';

const Trip = (props: TripProps) => {
  const { location, date } = props;

  return <div>{`location: ${location}; date: ${date}`}</div>;
};

export default Trip;
