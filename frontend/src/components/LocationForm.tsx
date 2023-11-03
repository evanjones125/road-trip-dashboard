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
  const [dateRange, setDateRange] = useState<[ValuePiece, ValuePiece]>([
    new Date(),
    new Date(),
  ]);
  const [locationFormData, setLocationFormData] = useState<LocationFormData>({
    locationName: '',
    latitude: '',
    longitude: '',
    user: '',
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const [startDate, endDate] = dateRange || [];
    onSubmit({ ...locationFormData, startDate, endDate });
    setLocationFormData({
      locationName: '',
      latitude: '',
      longitude: '',
      user: '',
    });
    setDateRange([new Date(), new Date()]);
  };

  // update state as the user types into the input boxes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLocationFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleDateChange = (value: Value) => {
    if (Array.isArray(value)) {
      setDateRange(value);
    } else {
      // Handle case where value is a single ValuePiece, if necessary
      // For now, we'll just set it as the start date and keep the end date the same
      setDateRange([value, dateRange[1]]);
    }
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

        <DateRangePicker onChange={handleDateChange} value={dateRange} />
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
