import React, { useState } from 'react';
import type {
  LocationFormProps,
  LocationFormData,
  Value,
  ValuePiece,
} from '../types/types';
import { TextField, Button, Box, Typography } from '@mui/material';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';

const LocationForm = (props: LocationFormProps): JSX.Element => {
  const { onSubmit } = props;
  const [dateRange, setDateRange] = useState<Value>([new Date(), new Date()]);
  const [locationFormData, setLocationFormData] = useState<LocationFormData>({
    locationName: '',
    startDate: '',
    endDate: '',
    latitude: '',
    longitude: '',
    user: '',
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    onSubmit(locationFormData);
    setLocationFormData({
      locationName: '',
      startDate: '',
      endDate: '',
      latitude: '',
      longitude: '',
      user: '',
    });
  };

  // update state as the user types into the input boxes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLocationFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      autoComplete="off"
      className="form"
    >
      <Typography variant="h4" gutterBottom>
        Add a location to this trip
      </Typography>

      <Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Location name"
            type="text"
            id="locationName"
            name="locationName"
            value={locationFormData.locationName}
            onChange={handleChange}
            variant="outlined"
          />
        </Box>

        <DateRangePicker onChange={setDateRange} value={dateRange} />
      </Box>

      <Box>
        <Button type="submit" variant="contained" color="primary">
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default LocationForm;
