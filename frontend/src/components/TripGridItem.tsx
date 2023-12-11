import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants/constants';
import { useNavigate } from 'react-router-dom';
import type {
  Location,
  TripGridItemProps,
  WeatherForecast,
} from '../types/types';
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
import { getWeatherDataForTrip } from '../utils/tripFunctions';

const TripGridItem: React.FC<TripGridItemProps> = ({ trip }) => {
  const [weather, setWeather] = useState<WeatherForecast[]>([]);
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
        setImageUrl(
          'https://media1.giphy.com/media/Ii3seJlOgcXqdkU5dY/giphy.gif?cid=ecf05e47rit1ohxcocmyzipq66i790qhx18uflta2elz8gc6&ep=v1_gifs_search&rid=giphy.gif&ct=g'
        );

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

    const fetchWeather = async () => {
      try {
        const result: WeatherForecast[] = await getWeatherDataForTrip(
          locations
        );
        setWeather(result);
      } catch (error) {
        console.error('Failed to fetch weather', error);
      }
    };

    fetchWeather();
  }, [locations]);

  return (
    <Card sx={{ maxWidth: 345, width: 345 }} className="mui-tree-card">
      <CardMedia
        sx={{ height: 200 }}
        image={imageUrl}
        title={`live feed of the nearest camera to`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {trip_name}
        </Typography>
        <Typography variant="h6">
          {start_date} to {end_date}
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'space-between' }}>
        <Tooltip
          title={
            weather.length
              ? 'The forecast for this trip includes precipitation'
              : 'No precipitation forecasted for this trip'
          }
          arrow
          placement="top"
        >
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
