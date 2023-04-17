import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Input from './components/Input';
import Trip from './components/Trip';
import type { Location } from './types/types';

const App = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [closestCameras, setClosestCameras] = useState<string[]>([]);

  // get all the locations from the database
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/locations/')
      .then((res: any) => setLocations(res.data))
      .catch((err) => console.log(err));
  }, []);

  // put an array in state of the closest cameras that corresponds with the locations array
  useEffect(() => {
    const fetchClosestCameras = async () => {
      const fetchedClosestCameras = await Promise.all(
        locations.map(async (location: Location) => {
          const camera = await axios
            .get(
              `http://localhost:8000/api/getCamera/closestCamera/${location.latitude},${location.longitude}/`
            )
            .catch((err) => console.log(err));
          return camera.data.camera_obj;
        })
      );

      setClosestCameras(fetchedClosestCameras);
    };

    if (locations.length > 0) fetchClosestCameras();
  }, [locations]);

  // gets the weather data from the nearest NWS location
  const getWeatherData = async (lat: string, lon: string) => {
    const weather = await axios
      .get(`http://localhost:8000/api/weather/forecast/${lat},${lon}/`)
      .catch((err) => console.log(err));

    console.log(weather);
  };

  // create a <li> for each Trip in the locations array
  const renderTrips = () => {
    return locations.map((location, i) => {
      return (
        <div className="trip-card" key={i}>
          {/* render the Trip components only after we've put data in the closestCameras array */}
          {closestCameras.length && (
            <Trip
              location={location.title}
              date={location.trip_date}
              camera={closestCameras[i]}
            />
          )}
        </div>
      );
    });
  };

  const addTrip = (formData: FormData) => {
    console.log('form submitted with value:', formData);
    const { location, date, lat, lon } = formData;

    // add a new location to the database
    axios
      .post('http://localhost:8000/api/locations/', {
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
