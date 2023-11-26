import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants/constants';
import { useNavigate } from 'react-router-dom';
import type { Location, TripGridItemProps } from '../types/types';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { deleteTrip } from '../features/tripsSlice';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Tooltip,
} from '@mui/material';

const TripGridItem: React.FC<TripGridItemProps> = ({ trip }) => {
  const [imageUrl, setImageUrl] = useState<string>(
    'https://www.nps.gov/webcams-glca/po1.jpg?1698334459793'
  );
  const { id, trip_name, start_date, end_date, locations } = trip;
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUrl = async () => {
      const locationsArray = locations as Location[];
      if (locationsArray && locationsArray.length > 0) {
        const firstLocation = locationsArray[0];
        const url = await axios
          .get(
            `${BASE_URL}/api/getCamera/closestCamera/${firstLocation?.latitude},${firstLocation?.longitude}/`
          )
          .then((res) => {
            return res.data.camera_obj.Url;
          })
          .catch((err) => console.log(err));

        setImageUrl(url);
      }
    };

    fetchUrl();
  }, [locations]);

  return (
    <Card sx={{ maxWidth: 345 }} className="mui-tree-card">
      <CardMedia
        sx={{ height: 200 }}
        image={imageUrl}
        title={`live feed of the nearest camera to`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {trip_name} from {start_date} to {end_date}
        </Typography>
        <Typography variant="body2">The nearest camera is the</Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'space-between' }}>
        <Tooltip title="weather" arrow placement="top">
          <Button size="small">weather</Button>
        </Tooltip>
        <Button
          size="small"
          style={{ color: '#69c983' }}
          onClick={() => {
            navigate(`/dashboard/locations/${id}`);
          }}
        >
          More info
        </Button>
        <Button
          size="small"
          style={{ color: '#fc2b2b' }}
          onClick={() => dispatch(deleteTrip(id))}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default TripGridItem;

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
