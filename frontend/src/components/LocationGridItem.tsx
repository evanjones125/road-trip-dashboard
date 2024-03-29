import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteLocation } from '../features/tripsSlice';
import { setCurrentLocation, clearLocations } from '../features/tripsSlice';
import type { AppDispatch } from '../store';
import type { LocationGridItemProps } from '../types/types';
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

const LocationGridItem: React.FC<LocationGridItemProps> = ({ location }) => {
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

  const dispatch: AppDispatch = useDispatch();
  const { id, location_name, start_date, end_date, camera } = location;
  const navigate = useNavigate();
  const { tripId } = useParams();

  return (
    <Card sx={{ maxWidth: 345 }} className="mui-tree-card">
      <CardMedia
        sx={{ height: 200 }}
        image={camera.Url}
        title={`live feed of the nearest camera to ${location_name}`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {location_name}{' '}
          {start_date === end_date
            ? `on ${start_date}`
            : `from ${start_date} to ${end_date}`}
        </Typography>
        <Typography variant="body2">
          The nearest camera is the {camera.Name}
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'space-between' }}>
        <Button
          size="small"
          onClick={() => {
            dispatch(setCurrentLocation(id));
            navigate(`/dashboard/locations/${tripId}/detailedView/${id}`);
          }}
        >
          Detailed view
        </Button>

        <Button
          size="small"
          style={{ color: '#fc2b2b' }}
          onClick={() => dispatch(deleteLocation(id))}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default LocationGridItem;
