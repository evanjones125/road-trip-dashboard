import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Input from './components/Input';

const App = () => {
  const [cameras, setCameras] = useState([]);
  const [locations, setLocations] = useState([]);

  const camerasArr = [
    {
      id: 1,
      name: 'SR12 @ Milepost 97.28 GA',
      agency: 'UDOT',
      latitude: '38.011700',
      longitude: '-111.370485',
      url: 'http://udottraffic.utah.gov/1_devices/SR-12-MP-97.gif',
    },
    {
      id: 2,
      name: 'SR12 @ GAWE County Line MP 109.84 GA',
      agency: 'UDOT',
      latitude: '38.147209',
      longitude: '-111.326950',
      url: 'http://udottraffic.utah.gov/1_devices/SR-12-MP-109.gif?rand=0.7404116890134775',
    },
    {
      id: 3,
      name: 'US191 Liveview SB @ SR46 La Sal Jct MP 103.55 SJ',
      agency: 'UDOT',
      latitude: '38.309937',
      longitude: '-109.404781',
      url: 'http://udottraffic.utah.gov/1_devices/us-191-mp-103.gif',
    },
    {
      id: 4,
      name: 'Main St SR63 @ Center St BCC',
      agency: 'UDOT',
      latitude: '37.674056',
      longitude: '-112.156216',
      url: 'http://udottraffic.utah.gov/1_devices/aux16683.jpeg',
    },
    {
      id: 5,
      name: 'US191 NB @ Arches Entrance Rd MP 130.28 GR',
      agency: 'UDOT',
      latitude: '38.611130',
      longitude: '-109.608187',
      url: 'http://udottraffic.utah.gov/1_devices/aux16852.jpeg?rand=0.7026757689401169',
    },
  ];

  const locationsArr = [
    {
      id: 2,
      title: 'Elephant Butte',
      latitude: '38.696597',
      longitude: '-109.540064',
      trip_date: '2023-04-09',
    },
    {
      id: 3,
      title: 'Bryce Canyon',
      latitude: '37.628186',
      longitude: '-112.167648',
      trip_date: '2023-04-11',
    },
  ];

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/cameras/')
      .then((res: any) => setCameras(res.data))
      .catch((err) => console.log(err));

    getWeatherData('37.6058', '-112.1838');
  }, []);

  const getWeatherData = async (lat: string, lon: string) => {
    const weather = await axios
      .get(`http://localhost:8000/api/weather/forecast/${lat},${lon}/`)
      .catch((err) => console.log(err));

    console.log(weather);
  };

  const renderLocations = () => {
    return locationsArr.map((location, i) => {
      const id = location.id;

      return (
        <div key={i}>
          <p>Location: {location.title}</p>
          <p>Trip date: {location.trip_date}</p>
          <img src={camerasArr[id - 1].url} alt="gif of live camera" />
          <p>test</p>
        </div>
      );
    });
  };

  return (
    <>
      <Input />

      <div id="test">
        <h1>Locations:</h1>
        <ul>{renderLocations()}</ul>
      </div>
    </>
  );
};

export default App;
