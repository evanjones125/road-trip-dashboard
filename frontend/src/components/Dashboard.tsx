import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TripGrid from '../components/TripGrid';
import LocationGrid from '../components/LocationGrid';
import { handleAxiosError } from '../utils/errorHandling';
import { BASE_URL } from '../constants/constants';
import type {
  Trip,
  Location,
  Camera,
  GetWeather,
  WeatherForecast,
} from '../types/types';

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { refreshSession } from '../features/authSlice';
import { fetchTrips } from '../features/tripsSlice';

const Dashboard = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [view, setView] = useState<'trip' | 'location'>('trip');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const { success, id } = useSelector((state: RootState) => state.auth);
  const { trips } = useSelector((state: RootState) => state.trips);
  const { currentLocations } = useSelector((state: RootState) => state.trips);
  const token: string | null = localStorage.getItem('token');

  // get all the trips from the database associated with the user that's currently logged in and put them in a state array
  useEffect(() => {
    if (token) {
      dispatch(refreshSession(token));
    }

    const fetchData = async () => {
      try {
        if (id) {
          await dispatch(fetchTrips(id));
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [success, dispatch, id]);

  // gets the weather data from the nearest NWS location
  const getWeatherData: GetWeather = async (
    lat: string,
    lon: string,
    date: string
  ): Promise<WeatherForecast> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/weather/weatherForecast/${lat},${lon},${date}/`
      );
      return response.data;
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const onLocationButtonClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setView('location');
  };

  const onBackButtonClick = () => {
    setView('trip');
    setSelectedTrip(null);
  };

  return (
    <>
      <Header />
      {view === 'trip' ? (
        <div id="main">
          <h1 className="welcomeText">
            {trips.length > 0
              ? "Welcome to your trip dashboard! Here's a list of your upcoming trips:"
              : "You don't have any trips planned. Create one below!"}
          </h1>
          <TripGrid
            trips={trips}
            onLocationButtonClick={onLocationButtonClick}
          />
        </div>
      ) : (
        <div id="main">
          <h1 className="welcomeText">
            {`Locations for ${selectedTrip?.trip_name}`}
          </h1>
          <LocationGrid
            locations={currentLocations.length > 0 ? currentLocations : []}
            onBackButtonClick={onBackButtonClick}
            tripId={selectedTrip ? selectedTrip.id : 0}
            userId={selectedTrip ? selectedTrip.user : 0}
          />
        </div>
      )}
      <Footer />
    </>
  );
};

export default Dashboard;
