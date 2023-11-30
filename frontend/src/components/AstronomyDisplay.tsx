import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants/constants';
import { handleAxiosError } from '../utils/errorHandling';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const AstronomyDisplay = () => {
  const [milkyWayData, setMilkyWayData] = useState<any>([]);
  const [sunAndMoonData, setSunAndMoonData] = useState<any>([]);
  const [tripDates, setTripDates] = useState<any>([]);
  const { selectedLocation } = useSelector((state: RootState) => state.trips);

  useEffect(() => {
    if (selectedLocation) {
      const getAstronomyDataForLocation = async () => {
        const { latitude, longitude, start_date, end_date } = selectedLocation;
        const currentDate = new Date(start_date);
        const endDate = new Date(end_date);

        const milkyWayArray = [];
        const sunAndMoonArray = [];
        const dates = [];

        while (currentDate <= endDate) {
          const dateString = currentDate.toISOString().slice(0, 10);
          dates.push(dateString);

          try {
            const response = await axios.get(
              `${BASE_URL}/api/astronomy/astronomyForecast/${latitude},${longitude},${dateString}/`
            );

            const astronomyData = response.data;
            const { milkyWay, sunAndMoon } = astronomyData;

            if (milkyWay) milkyWayArray.push(milkyWay);
            if (sunAndMoon) sunAndMoonArray.push(sunAndMoon);
          } catch (error) {
            handleAxiosError(error);
          }

          currentDate.setDate(currentDate.getDate() + 1);
        }

        setMilkyWayData(milkyWayArray);
        setSunAndMoonData(sunAndMoonArray);
        setTripDates(dates);
      };

      getAstronomyDataForLocation();
    }
  }, [selectedLocation]);

  // console.log(milkyWayData);
  // console.log(sunAndMoonData);
  // console.log(tripDates);

  return (
    <div className="astronomy-display">
      <h1>Astronomy Forecast</h1>

      <div className="forecast-table-wrapper">
        <table className="forecast-table">
          <thead>
            <tr>
              {tripDates.map((date: string, index: number) => (
                <th key={index} className="forecast-table-cell">
                  {date}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {milkyWayData.map((day: any, index: number) => {
                return (
                  <td key={index} className="forecast-table-cell">
                    <span className="forecast-table-bold">
                      Milky Way forecast:{' '}
                    </span>
                    <p>{day.report}</p>
                  </td>
                );
              })}
            </tr>

            <tr>
              {sunAndMoonData.map((day: any, index: number) => {
                return (
                  <td key={index} className="forecast-table-cell">
                    <span className="forecast-table-bold">Sunrise: </span>
                    <p className="forecast-detail-p">{day.sunrise}</p>
                    <span className="forecast-table-bold">Sunset: </span>
                    <p className="forecast-detail-p">{day.sunset}</p>
                    <span className="forecast-table-bold">
                      Best star viewing times:{' '}
                    </span>
                    {day.darkWindows.map((time: string, index: number) => {
                      return (
                        <p key={index}>
                          The sun and moon will both be set from {time[0]} to{' '}
                          {time[1]}
                        </p>
                      );
                    })}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AstronomyDisplay;
