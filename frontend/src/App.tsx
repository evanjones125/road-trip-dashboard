import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Input from './components/Input';
import Trip from './components/Trip';
import type { Location, FormData, Camera } from './types/types';

const App = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [closestCameras, setClosestCameras] = useState<Camera[]>([]);

  // get all the locations from the database
  useEffect(() => {
    axios
      .get(
        // 'http://tripdashboard-env.eba-gc2wq5ff.us-east-1.elasticbeanstalk.com/locations/'
        'http://localhost:8000/locations/'
      )
      .then((res) => setLocations(res.data))
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

  // put an array in state of the closest cameras that corresponds with the locations array
  useEffect(() => {
    const fetchClosestCameras = async () => {
      const fetchedClosestCameras: Camera[] = await Promise.all(
        locations.map(async (location: Location) => {
          const camera = await axios
            .get(
              // `http://tripdashboard-env.eba-gc2wq5ff.us-east-1.elasticbeanstalk.com/api/getCamera/closestCamera/${location.latitude},${location.longitude}/`
              `http://localhost:8000/api/getCamera/closestCamera/${location.latitude},${location.longitude}/`
            )
            // .then((res) => console.log(res.data))
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
          return camera?.data.camera_obj;
        })
      );

      setClosestCameras(fetchedClosestCameras);
    };

    if (locations.length > 0) fetchClosestCameras();
  }, [locations]);

  // gets the weather data from the nearest NWS location
  const getWeatherData = async (lat: string, lon: string) => {
    const weather = await axios
      .get(
        // `http://tripdashboard-env.eba-gc2wq5ff.us-east-1.elasticbeanstalk.com/weather/forecast/${lat},${lon}/`
        `http://localhost:8000/weather/forecast/${lat},${lon}/`
      )
      .catch((err) => console.log(err));

    // console.log(weather);
  };

  // create a <li> for each Trip in the locations array
  const renderTrips = () => {
    return locations.map((location, i) => {
      return (
        <div className="trip-card" key={i}>
          <Trip
            location={location}
            date={location.trip_date}
            camera={closestCameras[i]}
            deleteButton={deleteTrip}
            getWeather={getWeatherData}
          />
        </div>
      );
    });
  };

  const addTrip = (formData: FormData) => {
    const { location, date, lat, lon } = formData;

    // add a new location to the database
    axios
      .post('http://localhost:8080/locations/', {
        title: location,
        trip_date: date,
        latitude: lat,
        longitude: lon,
      })
      .then((response) => {
        // Update the locations state with the newly added trip
        setLocations((prevLocations) => [...prevLocations, response.data]);
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
      .delete(
        `http://tripdashboard-env.eba-gc2wq5ff.us-east-1.elasticbeanstalk.com/locations/${tripId}/`
      )
      .then(() => {
        // Update the locations and closestCameras state after deletion
        setLocations((prevLocations) =>
          prevLocations.filter((location) => location.id !== tripId)
        );
        setClosestCameras((prevCameras) =>
          prevCameras.filter((_, index) => index !== tripId)
        );
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
      <Input onSubmit={addTrip} />

      <div id="test">
        <h1>Trips:</h1>
        <div className="trips-container">{renderTrips()}</div>
      </div>
    </>
  );
};

export default App;
