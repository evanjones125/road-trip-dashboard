import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  // const [cameras, setCameras] = useState([]);

  const cameras = [
    {
      "id": 1,
      "name": "SR12 @ Milepost 97.28 GA",
      "agency": "UDOT",
      "latitude": "38.011700",
      "longitude": "-111.370485",
      "url": "http://udottraffic.utah.gov/1_devices/SR-12-MP-97.gif"
    },
    {
      "id": 2,
      "name": "SR12 @ GAWE County Line MP 109.84 GA",
      "agency": "UDOT",
      "latitude": "38.147209",
      "longitude": "-111.326950",
      "url": "http://udottraffic.utah.gov/1_devices/SR-12-MP-109.gif?rand=0.7404116890134775"
    },
    {
      "id": 3,
      "name": "US191 Liveview SB @ SR46 La Sal Jct MP 103.55 SJ",
      "agency": "UDOT",
      "latitude": "38.309937",
      "longitude": "-109.404781",
      "url": "http://udottraffic.utah.gov/1_devices/us-191-mp-103.gif"
    },
    {
      "id": 4,
      "name": "Main St SR63 @ Center St BCC",
      "agency": "UDOT",
      "latitude": "37.674056",
      "longitude": "-112.156216",
      "url": "http://udottraffic.utah.gov/1_devices/aux16683.jpeg"
    },
    {
      "id": 5,
      "name": "US191 NB @ Arches Entrance Rd MP 130.28 GR",
      "agency": "UDOT",
      "latitude": "38.611130",
      "longitude": "-109.608187",
      "url": "http://udottraffic.utah.gov/1_devices/aux16852.jpeg?rand=0.7026757689401169"
    }
  ]

  const locations = [
    {
      "id": 2,
      "title": "Elephant Butte",
      "latitude": "38.696597",
      "longitude": "-109.540064",
      "trip_date": "2023-04-09"
    },
    {
      "id": 3,
      "title": "Bryce Canyon",
      "latitude": "37.628186",
      "longitude": "-112.167648",
      "trip_date": "2023-04-11"
    }
  ]

  const findNearestCamera = () => {
    
  }

  const renderLocations = () => {
    return locations.map(location => {
      return (
        <div style={{borderBottom: '1px solid white'}}>
          <p>Location: {location.title}</p>
          <p>Trip date: {location.trip_date}</p>
          <img src={'http://udottraffic.utah.gov/1_devices/SR-56-MP0-53.gif'}/>
        </div>
      )
    })
  }

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Locations:</h1>
      <ul>
        {renderLocations()}
      </ul>

    </div>
  )
}

export default App
