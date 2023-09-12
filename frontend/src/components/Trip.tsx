import React, { useState, useEffect } from 'react';
import type { TripProps, WeatherForecast } from '../types/types';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Tooltip,
} from '@mui/material';

const Trip = (props: TripProps) => {
  const { location, date, camera, deleteButton, getWeather } = props;
  const [weather, setWeather] = useState<WeatherForecast | null>(null); // To store weather info

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
          <Tooltip
            title={
              <span className="tooltip">
                {weather?.dateInRange
                  ? weather.precipBeforeTrip?.map((period, i) => (
                      <p key={i}>{`${period[0]} there is a ${period[2].slice(
                        -4,
                        -1
                      )} chance of precipitation; ${period[2].slice(
                        0,
                        period[2].indexOf('.')
                      )}`}</p>
                    )) || 'Weather forecast looks clear!'
                  : 'No forecast yet for this date'}
              </span>
            }
            arrow
            placement="top"
          >
            <Button size="small">
              {weather?.precipBeforeTrip ? 'Weather (Alerts!!!)' : 'Weather'}
            </Button>
          </Tooltip>
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
