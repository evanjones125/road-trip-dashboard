import React, { useState, useEffect } from 'react';
import type { TripProps, WeatherForecast } from '../types/types';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from '@mui/material';

const Trip = (props: TripProps) => {
  const { location, date, camera, deleteButton, getWeather } = props;

  const [weather, setWeather] = useState<WeatherForecast | null>(null); // To store weather info
  const [loading, setLoading] = useState(true); // To know if data is still being fetched

  useEffect(() => {
    async function fetchWeather() {
      try {
        const result: WeatherForecast = await getWeather(
          location.latitude,
          location.longitude,
          date
        );
        setWeather(result); // Assuming the getWeather returns some string or data for weather.
      } catch (error) {
        console.error('Failed to fetch weather', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [location, date, getWeather]);

  return (
    camera && (
      <Card sx={{ maxWidth: 345 }} className="mui-tree-card">
        <CardMedia
          sx={{ height: 200 }}
          image={camera.url}
          title={`live feed of the nearest camera to ${location}`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {location.title} on {date}
          </Typography>
          <Typography variant="body2">
            The nearest camera is the {camera.name}
          </Typography>
        </CardContent>
        <CardActions style={{ justifyContent: 'space-between' }}>
          <Button
            size="small"
            onClick={() =>
              getWeather(location.latitude, location.longitude, date)
            }
          >
            {weather?.precipBeforeTrip ? 'Weather (Alerts!!!)' : 'Weather'}
          </Button>
          <Button
            size="small"
            style={{ color: '#fc2b2b' }}
            onClick={() => deleteButton(location.id)}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    )
  );
};

export default Trip;
