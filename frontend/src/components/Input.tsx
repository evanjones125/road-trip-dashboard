import React, { useState } from 'react';
import type { InputProps } from '../types/types';
import { TextField, Button, Box, Typography } from '@mui/material';

const Input = (props: InputProps): JSX.Element => {
  const { onSubmit } = props;
  const [formData, setFormData] = useState({
    location: '',
    lat: '',
    lon: '',
    date: '',
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
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

      <Box mb={2}>
        <TextField
          fullWidth
          label="Location"
          type="text"
          id="location"
          name="location"
          onChange={handleChange}
          variant="outlined"
        />
      </Box>

      <Box mb={2}>
        <TextField
          fullWidth
          label="Date"
          type="date"
          id="date"
          name="date"
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
          label="Latitude"
          type="text"
          id="lat"
          name="lat"
          onChange={handleChange}
          variant="outlined"
        />
      </Box>

      <Box mb={2}>
        <TextField
          fullWidth
          label="Longitude"
          type="text"
          id="lon"
          name="lon"
          onChange={handleChange}
          variant="outlined"
        />
      </Box>

      <Box>
        <Button type="submit" variant="contained" color="primary">
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default Input;
