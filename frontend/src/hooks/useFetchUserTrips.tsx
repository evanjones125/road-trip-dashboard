// hooks/useFetchUserTrips.ts
import { useState, useEffect } from 'react';
import { fetchUserTrips } from '../utils/tripFunctions';
import type { Trip } from '../types/types';

const useFetchUserTrips = (userId: number) => {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserTrips(userId);
        setTrips(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId]);

  return trips;
};

export default useFetchUserTrips;
