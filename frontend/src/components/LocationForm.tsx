import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { addLocation } from '../features/tripsSlice';
import type { FormErrors, FormData, Value } from '../types/types';
import {
  formatDate,
  validateInput,
  DEFAULT_FORM_DATA,
  DEFAULT_FORM_ERRORS,
} from '../utils/formFunctions';
import { TextField, Button, Box, Typography } from '@mui/material';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';

const LocationForm = (): JSX.Element => {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>(DEFAULT_FORM_ERRORS);

  const dispatch: AppDispatch = useDispatch();
  const { locationName, latitude, longitude, dateRange } = formData;

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const errors = validateInput(formData, 'location');

    if (Object.keys(errors).length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, ...errors }));
    } else {
      dispatch(addLocation(formData));
      resetForm();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const resetForm = (): void => {
    setFormData(DEFAULT_FORM_DATA);
    setErrors(DEFAULT_FORM_ERRORS);
  };

  // needs custom logic for updating dateRange in state because the calendar component, by default, uses a different date format than what I want to use in this component
  const handleDateChange = (date: Value): void => {
    if (Array.isArray(date)) {
      const [startDate, endDate] = date;
      setFormData((prevFormData) => ({
        ...prevFormData,
        dateRange: [
          startDate ? formatDate(startDate) : null,
          endDate ? formatDate(endDate) : null,
        ].filter((date): date is string => date !== null),
      }));
    }
  };

  const dateRangePickerClass = errors.dateRange ? 'error-border' : '';

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
            value={locationName}
            onChange={handleChange}
            variant="outlined"
            error={!!errors.locationName}
            helperText={errors.locationName}
          />
        </Box>

        <DateRangePicker
          onChange={handleDateChange}
          value={
            dateRange && dateRange.length === 2
              ? [
                  new Date(
                    new Date(dateRange[0]).setDate(
                      new Date(dateRange[0]).getDate() + 1
                    )
                  ),
                  new Date(
                    new Date(dateRange[1]).setDate(
                      new Date(dateRange[1]).getDate() + 1
                    )
                  ),
                ]
              : [new Date(), new Date()]
          }
          className={dateRangePickerClass}
        />
        {errors.dateRange && (
          <p className="error-message">{errors.dateRange}</p>
        )}

        <Box mb={2}>
          <TextField
            fullWidth
            label="Latitude"
            type="text"
            id="latitude"
            name="latitude"
            value={latitude}
            onChange={handleChange}
            variant="outlined"
            error={!!errors.latitude}
            helperText={errors.latitude}
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="Longitude"
            type="text"
            id="longitude"
            name="longitude"
            value={longitude}
            onChange={handleChange}
            variant="outlined"
            error={!!errors.longitude}
            helperText={errors.longitude}
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

export default LocationForm;
