import * as React from 'react';
import type { TripProps } from '../types/types';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Trip = (props: TripProps) => {
  const { location, date, camera, deleteButton, getWeather } = props;

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
            Weather
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
