import React from 'react';

type TripProps = {
  location: string;
  date: string;
};

const Trip = (props: TripProps) => {
  const { location, date } = props;

  return <div>{`location: ${location}; date: ${date}`}</div>;
};

export default Trip;
