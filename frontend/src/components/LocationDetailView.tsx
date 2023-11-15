import React from 'react';
import { useParams } from 'react-router-dom';

const LocationDetailView = () => {
  const { tripId } = useParams();

  return (
    <div>
      <h1>LocationDetailView</h1>
      <a href={`/dashboard/locations/${tripId}`}>Back to LocationGrid</a>
    </div>
  );
};

export default LocationDetailView;
