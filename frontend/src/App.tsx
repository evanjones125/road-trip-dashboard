import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import TripForm from './components/TripForm';
import TripGrid from './components/TripGrid';
import TripGridItem from './components/TripGridItem';
import { handleAxiosError } from './utils/errorHandling';
import { fetchUserTrips } from './utils/tripFunctions';
import { BASE_URL } from './constants/constants';
import type {
  Trip,
  Location,
  TripFormData,
  Camera,
  GetWeather,
  WeatherForecast,
} from './types/types';

const App = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [closestCameras, setClosestCameras] = useState<Camera[]>([]);
  // to-do: add a state structure to keep track of whether trip view or location view is enabled

  // get all the trips from the database associated with the user that's currently logged in and put them in a state array
  useEffect(() => {
    const fetchData = async () => {
      try {
        const trips = await fetchUserTrips(1);
        setTrips(trips);
        let allLocations: Location[] = [];
        trips.forEach((trip: Trip) => {
          allLocations = [...allLocations, ...trip.locations];
        });
        setLocations(allLocations);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // put an array in state of the closest cameras that corresponds with the locations array
  useEffect(() => {
    const fetchClosestCameras = async () => {
      const fetchedClosestCameras: Camera[] = await Promise.all(
        locations.map(async (location: Location) => {
          const camera = await axios
            .get(
              `${BASE_URL}/api/getCamera/closestCamera/${location.latitude},${location.longitude}/`
            )
            .catch(handleAxiosError);
          return camera?.data.camera_obj;
        })
      );

      setClosestCameras(fetchedClosestCameras);
    };

    if (locations.length > 0) fetchClosestCameras();
  }, [locations]);

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

  const addTrip = (formData: TripFormData) => {
    const { tripName, startDate, endDate } = formData;

    axios
      .post(`${BASE_URL}/trips/`, {
        trip_name: tripName,
        start_date: startDate,
        end_date: endDate,
        user: '1',
      })
      .then((response) => {
        setTrips((prevTrips) => [...prevTrips, response.data]);
      })
      .catch(handleAxiosError);
  };

  const deleteTrip = (tripId: number) => {
    axios
      .delete(`${BASE_URL}/trips/${tripId}/`)
      .then(() => {
        setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
        // setClosestCameras((prevCameras) =>
        //   prevCameras.filter((_, index) => index !== tripId)
        // );
      })
      .catch(handleAxiosError);
  };

  return (
    <>
      <Header />
      <div id="main">
        <h1 className="welcomeText">
          {trips.length > 0
            ? "Welcome to your trip dashboard! Here's a list of your upcoming trips:"
            : "You don't have any trips planned. Create one below!"}
        </h1>
        <TripGrid trips={trips} deleteTrip={deleteTrip} addTrip={addTrip} />
      </div>
      <Footer />
    </>
  );
};

export default App;
