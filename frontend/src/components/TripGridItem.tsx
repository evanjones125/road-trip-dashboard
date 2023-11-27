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
import { handleAxiosError } from '../utils/errorHandling';

const TripGridItem: React.FC<TripGridItemProps> = ({ trip }) => {
  const [weather, setWeather] = useState<WeatherForecast[]>([]);
  const [imageUrl, setImageUrl] = useState<string>(
    'https://www.nps.gov/webcams-glca/po1.jpg?1698334459793'
  );
  const { id, trip_name, start_date, end_date, locations } = trip;
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  // checks the date ranges for all the locations in the locations array and returns an array of any weather alerts for any location in the entire trip
  const getWeatherData = async (
    locations: Location[]
  ): Promise<WeatherForecast[]> => {
    const weatherAlerts: WeatherForecast[] = [];

    for (const location of locations) {
      const { latitude, longitude, start_date, end_date } = location;
      const currentDate = new Date(start_date);
      const endDate = new Date(end_date);

      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().slice(0, 10);

        try {
          const response = await axios.get(
            `${BASE_URL}/api/weather/weatherForecast/${latitude},${longitude},${dateString}/`
          );
          const weatherData = response.data;
          if (weatherData.precipBeforeTrip) {
            weatherAlerts.push(weatherData.precipBeforeTrip);
          }
        } catch (err) {
          handleAxiosError(err);
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return weatherAlerts;
  };

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

    const fetchWeather = async () => {
      try {
        const result: WeatherForecast[] = await getWeatherData(locations);
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
              ? 'The forecast for this trip includes rain'
              : 'No rain forecasted for this trip'
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
