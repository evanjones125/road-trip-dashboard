import axios from 'axios';
import { BASE_URL } from '../constants/constants';
import { handleAxiosError } from '../utils/errorHandling';
import type { WeatherForecast, Location } from '../types/types';

export const fetchUserTrips = async (userId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/${userId}/trips/`);
    return response.data;
  } catch (err) {
    handleAxiosError(err);
  }
};

// checks the date ranges for all the locations in the locations array and returns an array of any weather alerts for any location in the entire trip
export const getWeatherDataForTrip = async (
  locations: Location[]
): Promise<WeatherForecast[]> => {
  const weatherAlerts: WeatherForecast[] = [];

  for (const location of locations) {
    const { latitude, longitude, start_date, end_date } = location;
    const currentDate = new Date(start_date);
    const endDate = new Date(end_date);

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().slice(0, 10);

      try {
        const response = await axios.get(
          `${BASE_URL}/api/weather/weatherForecast/${latitude},${longitude},${dateString}/`
        );

        const weatherData = response.data;
        if (weatherData.precipBeforeTrip) {
          weatherAlerts.push(weatherData.precipBeforeTrip);
        }
      } catch (err) {
        handleAxiosError(err);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return weatherAlerts;
};
