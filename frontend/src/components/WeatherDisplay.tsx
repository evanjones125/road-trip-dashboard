import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants/constants';
import { handleAxiosError } from '../utils/errorHandling';
import type { WeatherForecast } from '../types/types';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const WeatherDisplay = () => {
  const [weatherAlerts, setWeatherAlerts] = useState<any>([]);
  const [weatherForecast, setWeatherForecast] = useState<any>([]);
  const [tripDates, setTripDates] = useState<any>([]);
  const { selectedLocation } = useSelector((state: RootState) => state.trips);

  useEffect(() => {
    if (selectedLocation) {
      const getWeatherDataForLocation = async () => {
        const { latitude, longitude, start_date, end_date } = selectedLocation;
        const currentDate = new Date(start_date);
        const endDate = new Date(end_date);

        let alerts: string[] = [];
        const forecastArray = [];
        const dates = [];

        while (currentDate <= endDate) {
          const dateString = currentDate.toISOString().slice(0, 10);
          dates.push(dateString);

          try {
            const response = await axios.get(
              `${BASE_URL}/api/weather/weatherForecast/${latitude},${longitude},${dateString}/`
            );

            const weatherData = response.data;
            const { precipBeforeTrip, forecast } = weatherData;

            if (precipBeforeTrip) alerts = precipBeforeTrip;

            const forecastObject: any = {};

            for (const window of forecast) {
              if (window.startTime.slice(0, 10) === dateString) {
                if (window.isDaytime) {
                  forecastObject['day'] = {
                    detailedForecast: window.detailedForecast,
                    windSpeed: window.windSpeed,
                    probabilityOfPrecipitation:
                      window.probabilityOfPrecipitation,
                    temperature: window.temperature,
                  };
                } else {
                  forecastObject['night'] = {
                    detailedForecast: window.detailedForecast,
                    windSpeed: window.windSpeed,
                    probabilityOfPrecipitation:
                      window.probabilityOfPrecipitation,
                    temperature: window.temperature,
                  };
                }

                forecastObject['date'] = window.startTime.slice(0, 10);
                forecastObject['dayOfWeek'] = window.name.split(' ')[0];
              }
            }

            forecastArray.push(forecastObject);
          } catch (err) {
            handleAxiosError(err);
          }

          currentDate.setDate(currentDate.getDate() + 1);
        }

        setWeatherAlerts(alerts);
        setWeatherForecast(forecastArray);
        setTripDates(dates);
      };

      getWeatherDataForLocation();
    }
  }, [selectedLocation]);

  return (
    <div className="weather-display">
      <h1>Weather</h1>
      <h3 className="weather-alert-header">Alerts:</h3>
      {weatherAlerts.length > 0 ? (
        weatherAlerts.map((alert: any, key: number) => (
          <p className="weather-alert-text" key={key}>
            <span className="weather-alert-text-bold">{alert[0]}</span>,{' '}
            <span className="weather-alert-text-bold">{alert[1]}</span>:{' '}
            {alert[2]}
          </p>
        ))
      ) : (
        <p className="weather-alert-text">No weather alerts</p>
      )}

      <h3 className="weather-alert-header">Full forecast:</h3>

      <div className="weather-forecast-table-wrapper">
        <table className="weather-forecast-table">
          <thead>
            <tr className="weather-forecast-table-header">
              {tripDates.map((date: any, key: number) => (
                <th key={key} className="weather-forecast-table-cell">
                  {date}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr className="weather-forecast-table-row">
              {weatherForecast.length > 0
                ? weatherForecast.map((forecast: any, key: number) => (
                    <td key={key} className="weather-forecast-table-cell">
                      {forecast['day'] ? (
                        <>
                          <p style={{ paddingBottom: '8px' }}>
                            <span className="forecast-table-bold">
                              {forecast['dayOfWeek']}:{' '}
                            </span>
                            {forecast['day']['detailedForecast']}
                          </p>
                          <p>
                            <span className="forecast-table-bold">
                              {forecast['dayOfWeek']} Night:{' '}
                            </span>
                            {forecast['night']['detailedForecast']}
                          </p>
                        </>
                      ) : (
                        'Date out of range for NWS forecast'
                      )}
                    </td>
                  ))
                : null}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeatherDisplay;
