import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTrip } from '../features/tripsSlice';
import type { TripFormProps } from '../types/types';
import { TextField, Button, Box, Typography } from '@mui/material';

const TripForm = (props: TripFormProps): JSX.Element => {
  const { onSubmit } = props;
  const [tripFormData, setTripFormData] = useState({
    tripName: '',
    startDate: '',
    endDate: '',
    user: '',
  });
  const { tripName, startDate, endDate } = tripFormData;

  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // dispatch(
    //   addTrip({
    //     id: 1,
    //     user: 1,
    //     trip_name: tripName,
    //     start_date: startDate,
    //     end_date: endDate,
    //     locations: [],
    //   })
    // );
    onSubmit(tripFormData);
    setTripFormData({
      tripName: '',
      startDate: '',
      endDate: '',
      user: '',
    });
  };

  // update state as the user types into the input boxes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setTripFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      autoComplete="off"
      className="form"
    >
      <Typography variant="h4" gutterBottom>
        Add a trip to your dashboard
      </Typography>

      <Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Trip name"
            type="text"
            id="tripName"
            name="tripName"
            value={tripFormData.tripName}
            onChange={handleChange}
            variant="outlined"
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="Start date"
            type="date"
            id="startDate"
            name="startDate"
            value={tripFormData.startDate}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleChange}
            variant="outlined"
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="End date"
            type="date"
            id="endDate"
            name="endDate"
            value={tripFormData.endDate}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleChange}
            variant="outlined"
          />
        </Box>
      </Box>

      <Box>
        <Button type="submit" variant="contained" color="primary">
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default TripForm;
