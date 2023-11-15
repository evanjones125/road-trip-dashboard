import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TripGrid from '../components/TripGrid';
import LocationGrid from '../components/LocationGrid';

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { refreshSession } from '../features/authSlice';
import { fetchTrips } from '../features/tripsSlice';
import { Routes, Route, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { success, id } = useSelector((state: RootState) => state.auth);
  const { trips, currentLocations } = useSelector(
    (state: RootState) => state.trips
  );

  // get all the trips from the database associated with the user that's currently logged in and put them in a state array
  useEffect(() => {
    const token: string | null = localStorage.getItem('token');

    if (token) {
      dispatch(refreshSession(token));
    }

    if (id) {
      dispatch(fetchTrips(id));
    }
  }, [success, dispatch, id, currentLocations]);

  const handleLocationButtonClick = (tripId: number) => {
    navigate(`/dashboard/locations/${tripId}`);
  };

  const handleBackButtonClick = () => {
    navigate('/dashboard/trips');
  };

  return (
    <>
      <Header />
      <div id="main">
        <Routes>
          <Route
            path="/trips"
            element={
              <TripGrid
                trips={trips}
                onLocationButtonClick={handleLocationButtonClick}
              />
            }
          ></Route>
          <Route
            path="/locations/:tripId"
            element={
              <LocationGrid
                locations={currentLocations}
                onBackButtonClick={handleBackButtonClick}
              />
            }
          ></Route>
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;

// // gets the weather data from the nearest NWS location
// const getWeatherData: GetWeather = async (
//   lat: string,
//   lon: string,
//   date: string
// ): Promise<WeatherForecast> => {
//   try {
//     const response = await axios.get(
//       `${BASE_URL}/api/weather/weatherForecast/${lat},${lon},${date}/`
//     );
//     return response.data;
//   } catch (err) {
//     handleAxiosError(err);
//   }
// };

// const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
// const [view, setView] = useState<'trip' | 'location'>('trip');
// {
/* <Header />
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
          />
        </div>
      )}
      <Footer /> */
// }
