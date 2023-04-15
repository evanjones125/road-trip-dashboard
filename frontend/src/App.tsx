import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Input from './components/Input';
import Trip from './components/Trip';
import type { Camera, Location } from './types/types';

const App = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

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

  // gets the weather data from the nearest NWS location
  const getWeatherData = async (lat: string, lon: string) => {
    const weather = await axios
      .get(`http://localhost:8000/api/weather/forecast/${lat},${lon}/`)
      .catch((err) => console.log(err));

    console.log(weather);
  };

  const findCLosestCamera = (location: Location) => {
    // const cameraURL = await axios
    //   .get<string>(
    //     `http://localhost:8000/api/getCamera/${location.latitude},${location.longitude}/`
    //   )
    //   .catch((err) => console.log(err));

    const cameraURL =
      'http://udottraffic.utah.gov/1_devices/SR-12-MP-109.gif?rand=0.7404116890134775';
    return cameraURL;
  };

  const renderTrips = () => {
    return locations.map((location, i) => {
      // const id = location.id;

      return (
        <>
          <Trip
            location={location.title}
            date={location.trip_date}
            camera={findCLosestCamera(location)}
            // camera={
            //   'http://udottraffic.utah.gov/1_devices/SR-12-MP-109.gif?rand=0.7404116890134775'
            // }
            key={i}
          />

          {/* <div>
            <img src={camerasArr[id - 1].url} alt="gif of live camera" />
            <p>test</p>
          </div> */}
        </>
      );
    });
  };

  return (
    <>
      <Input />

      <div id="test">
        <h1>Trips:</h1>
        <ul>{renderTrips()}</ul>
      </div>
    </>
  );
};

export default App;
