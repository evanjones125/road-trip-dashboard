import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TripGrid from '../components/TripGrid';
import LocationGrid from '../components/LocationGrid';
import LocationDetailView from './LocationDetailView';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { refreshSession } from '../features/authSlice';
import { fetchTrips } from '../features/tripsSlice';

const Dashboard = () => {
  const dispatch: AppDispatch = useDispatch();
  const { success, id } = useSelector((state: RootState) => state.auth);
  const { trips, currentLocations } = useSelector(
    (state: RootState) => state.trips
  );

  // get all the trips from the database associated with the user that's currently logged in and put them in the redux store
  useEffect(() => {
    const token: string | null = localStorage.getItem('token');

    if (token) {
      dispatch(refreshSession(token));
    }

    if (id) {
      dispatch(fetchTrips(id));
    }
  }, [success, dispatch, id, currentLocations]);

  return (
    <>
      <Header />
      <div id="main">
        <Routes>
          <Route path="/trips" element={<TripGrid trips={trips} />}></Route>
          <Route
            path="/locations/:tripId"
            element={<LocationGrid locations={currentLocations} />}
          ></Route>
          <Route
            path="/locations/:tripId/detailedView"
            element={<LocationDetailView />}
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
