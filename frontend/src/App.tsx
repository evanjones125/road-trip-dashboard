import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import TripGrid from './components/TripGrid';
import LocationGrid from './components/LocationGrid';
import { handleAxiosError } from './utils/errorHandling';
import { fetchUserTrips } from './utils/tripFunctions';
import { BASE_URL } from './constants/constants';
import type {
  Trip,
  Location,
  LocationWithCameras,
  TripFormData,
  Camera,
  GetWeather,
  WeatherForecast,
  FormData,
} from './types/types';

const App = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsWithCameras, setLocationsWithCameras] = useState<
    LocationWithCameras[]
  >([]);
  const [view, setView] = useState<'trip' | 'location'>('trip');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [closestCameras, setClosestCameras] = useState<Camera[]>([]);

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
      const updatedLocationsWithCameras = [];
      for (const location of locations) {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/getCamera/closestCamera/${location.latitude},${location.longitude}/`
          );

          const updatedLocation = {
            ...location,
            camera: response.data.camera_obj,
          };

          updatedLocationsWithCameras.push(updatedLocation);
        } catch (error) {
          handleAxiosError(error);
        }
      }

      setLocationsWithCameras(updatedLocationsWithCameras);
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

  const addLocation = (formData: FormData) => {
    if (!selectedTrip) return;

    const { id } = selectedTrip;
    const { dateRange, latitude, longitude, locationName } = formData;

    axios
      .post(`${BASE_URL}/trips/${id}/add_location/`, {
        location_name: locationName,
        start_date: dateRange[0],
        end_date: dateRange[1],
        latitude: latitude,
        longitude: longitude,
        trip: id,
      })
      .then((response) => {
        setLocations((prevLocations) => [...prevLocations, response.data]);
      })
      .catch(handleAxiosError);
  };

  const deleteLocation = () => {
    return;
  };

  const fetchLocationsFromSelectedTrip = (
    tripId: number
  ): LocationWithCameras[] => {
    return locationsWithCameras.filter((location) => location.trip === tripId);
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
            deleteTrip={deleteTrip}
            addTrip={addTrip}
            onLocationButtonClick={onLocationButtonClick}
          />
        </div>
      ) : (
        <div id="main">
          <h1 className="welcomeText">
            {`Locations for ${selectedTrip?.trip_name}`}
          </h1>
          <LocationGrid
            locations={
              selectedTrip
                ? fetchLocationsFromSelectedTrip(selectedTrip.id)
                : []
            }
            addLocation={addLocation}
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

export default App;
