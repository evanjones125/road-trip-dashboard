import React from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants/constants';
import { handleAxiosError } from '../utils/errorHandling';

const WeatherDisplay = () => {
  // gets the weather data from the nearest NWS location
  const getWeatherData: any = async (
    lat: string,
    lon: string,
    date: string
  ): Promise<any> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/weather/weatherForecast/${lat},${lon},${date}/`
      );
      return response.data;
    } catch (err) {
      handleAxiosError(err);
    }
  };

  return (
    <div>
      <h1>Weather Display</h1>
    </div>
  );
};

export default WeatherDisplay;
