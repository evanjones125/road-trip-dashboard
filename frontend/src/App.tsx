import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Input from './components/Input';
import Trip from './components/Trip';
import type { Camera, Location } from './types/types';

const App = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [closestCameras, setClosestCameras] = useState<string[]>([]);

  useEffect(() => {
    // get all the camera urls from the database
    axios
      .get('http://localhost:8000/api/cameras/')
      .then((res: any) => setCameras(res.data))
      .catch((err) => console.log(err));

    // get all the locations from the database
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
          const cameraUrl = await axios
            .get(
              `http://localhost:8000/api/getCamera/closestCamera/${location.latitude},${location.longitude}/`
            )
            .catch((err) => console.log(err));
          return cameraUrl.data.url;
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

  const renderTrips = () => {
    return locations.map((location, i) => {
      // console.log(location);
      return (
        <>
          <Trip
            location={location.title}
            date={location.trip_date}
            camera={closestCameras[i]}
            key={i}
          />
        </>
      );
    });
  };

  const addTrip = (val: any) => {
    console.log('form submitted with value:', val);
  };

  return (
    <>
      <Input onSubmit={addTrip} />

      <div id="test">
        <h1>Trips:</h1>
        <ul>{renderTrips()}</ul>
      </div>
    </>
  );
};

export default App;
