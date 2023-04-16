import * as React from 'react';
import type { TripProps } from '../types/types';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Trip = (props: TripProps) => {
  const { location, date, camera } = props;

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 200 }}
        image={camera}
        title={`live feed of the nearest camera to ${location}`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {location} on {date}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The nearest camera is the {location}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};

export default Trip;
