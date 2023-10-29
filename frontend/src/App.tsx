import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import TripForm from './components/TripForm';
import TripGridItem from './components/TripGridItem';
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

  // x get all the locations from the database
  // -> get all the trips from the database associated with the user that's currently logged in
  useEffect(() => {
    axios
      // use authentication token that corresponds with a user ID in the database to fetch the trips associated with that ID
      .get('http://localhost:8000/user/1/trips/')
      .then((res) => {
        setTrips(res.data);
        let allLocations: Location[] = [];
        res.data.forEach((trip: Trip) => {
          allLocations = [...allLocations, ...trip.locations];
        });
        setLocations(allLocations);
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser
          // and an instance of http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  }, []);

  console.log(locations);

  // put an array in state of the closest cameras that corresponds with the locations array
  // useEffect(() => {
  //   const fetchClosestCameras = async () => {
  //     const fetchedClosestCameras: Camera[] = await Promise.all(
  //       trips.map(async (trip: Trip) => {
  //         const camera = await axios
  //           .get(
  //             `http://localhost:8000/api/getCamera/closestCamera/${location.latitude},${location.longitude}/`
  //           )
  //           .catch(function (error) {
  //             if (error.response) {
  //               // The request was made and the server responded with a status code
  //               // that falls out of the range of 2xx
  //               console.log(error.response.data);
  //               console.log(error.response.status);
  //               console.log(error.response.headers);
  //             } else if (error.request) {
  //               // The request was made but no response was received
  //               // `error.request` is an instance of XMLHttpRequest in the browser
  //               // and an instance of http.ClientRequest in node.js
  //               console.log(error.request);
  //             } else {
  //               // Something happened in setting up the request that triggered an Error
  //               console.log('Error', error.message);
  //             }
  //           });
  //         return camera?.data.camera_obj;
  //       })
  //     );

  //     setClosestCameras(fetchedClosestCameras);
  //   };

  //   if (locations.length > 0) fetchClosestCameras();
  // }, [locations]);

  // gets the weather data from the nearest NWS location
  const getWeatherData: GetWeather = async (
    lat: string,
    lon: string,
    date: string
  ): Promise<WeatherForecast> => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/weather/weatherForecast/${lat},${lon},${date}/`
      );
      // console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  // create a <li> for each Trip in the locations array
  // const renderTrips = () => {
  //   return locations.map((location, i) => {
  //     return (
  //       <div className="trip-card" key={i}>
  //         <TripGridItem
  //           location={location}
  //           date={location.trip_date}
  //           camera={closestCameras[i]}
  //           deleteButton={deleteTrip}
  //           getWeather={getWeatherData}
  //         />
  //       </div>
  //     );
  //   });
  // };

  const addTrip = (formData: TripFormData) => {
    const { tripName, startDate, endDate } = formData;

    // add a new location to the database
    axios
      .post('http://localhost:8000/trips/', {
        trip_name: tripName,
        start_date: startDate,
        end_date: endDate,
        user: '1',
      })
      .then((response) => {
        // Update the locations state with the newly added trip
        setTrips((prevTrips) => [...prevTrips, response.data]);
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser
          // and an instance of http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };

  const deleteTrip = (tripId: number) => {
    axios
      .delete(`http://localhost:8000/trips/${tripId}/`)
      .then(() => {
        // Update the locations and closestCameras state after deletion
        setLocations((prevTrips) =>
          prevTrips.filter((trip) => trip.id !== tripId)
        );
        // setClosestCameras((prevCameras) =>
        //   prevCameras.filter((_, index) => index !== tripId)
        // );
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error);
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser
          // and an instance of http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
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
        {/* <div className="trips-container">{renderTrips()}</div> */}
        <TripForm onSubmit={addTrip} />
      </div>
      <Footer />
    </>
  );
};

export default App;
