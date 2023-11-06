import React, { useState, useEffect } from 'react';
import type { LocationGridItemProps, WeatherForecast } from '../types/types';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Tooltip,
} from '@mui/material';

// const TooltipContent: React.FC<{ weather: WeatherForecast | null }> = ({
//   weather,
// }) => {
//   // check if date is in range for weather forecast and, if so, if there's precipitation in the forecast
//   if (!weather?.dateInRange)
//     return <span className="tooltip">No forecast for this date yet.</span>;
//   if (!weather?.precipBeforeTrip[0])
//     return <span className="tooltip">Weather forecast looks clear!</span>;

//   // put the upcoming adverse weather forecast items in the tooltip
//   return (
//     <span className="tooltip">
//       {weather.precipBeforeTrip.map((period, key) => (
//         <p key={key}>{`${period[0]} there is a ${period[2].slice(
//           -4,
//           -1
//         )} chance of precipitation;
//           ${period[2].slice(0, period[2].indexOf('.'))}`}</p>
//       ))}
//     </span>
//   );
// };

const TripGridItem: React.FC<LocationGridItemProps> = ({
  location,
  deleteLocation,
  onBackButtonClick,
}) => {
  // const [weather, setWeather] = useState<WeatherForecast | null>(null);

  // const navigation = useNavigation();

  // const redirectToTripDetail = () => {
  //   navigation.navigate(`/trip/${location.id}`);
  // };

  // useEffect(() => {
  //   async function fetchWeather() {
  //     try {
  //       const result: WeatherForecast = await getWeather(
  //         location.latitude,
  //         location.longitude,
  //         date
  //       );
  //       setWeather(result); // Assuming the getWeather returns some string or data for weather.
  //     } catch (error) {
  //       console.error('Failed to fetch weather', error);
  //     }
  //   }

  //   fetchWeather();
  // }, [location, date, getWeather]);

  const { id, location_name, start_date, end_date, camera } = location;

  return (
    <Card sx={{ maxWidth: 345 }} className="mui-tree-card">
      <CardMedia
        sx={{ height: 200 }}
        image={camera.Url}
        title={`live feed of the nearest camera to ${location_name}`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {location_name} from {start_date} to {end_date}
        </Typography>
        <Typography variant="body2">
          The nearest camera is the {camera.Name}
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'space-between' }}>
        <Tooltip title="weather" arrow placement="top">
          <Button size="small">weather</Button>
        </Tooltip>
        <Button
          size="small"
          style={{ color: '#69c983' }}
          onClick={() => onBackButtonClick()}
        >
          Back to trips
        </Button>
        <Button
          size="small"
          style={{ color: '#fc2b2b' }}
          onClick={() => deleteLocation(id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default TripGridItem;
