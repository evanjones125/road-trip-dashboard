import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants/constants';
import { handleAxiosError } from '../utils/errorHandling';
import { useSelector } from 'react-redux';
import type { MilkyWayData, SunAndMoonData } from '../types/types';
import type { RootState } from '../store';

const AstronomyDisplay = () => {
  const [milkyWayData, setMilkyWayData] = useState<MilkyWayData[]>([]);
  const [sunAndMoonData, setSunAndMoonData] = useState<SunAndMoonData[]>([]);
  const [tripDates, setTripDates] = useState<string[]>([]);
  const { selectedLocation } = useSelector((state: RootState) => state.trips);

  useEffect(() => {
    if (selectedLocation) {
      const getAstronomyDataForLocation = async () => {
        const { latitude, longitude, start_date, end_date } = selectedLocation;
        const currentDate = new Date(start_date);
        const endDate = new Date(end_date);

        const milkyWayArray: MilkyWayData[] = [];
        const sunAndMoonArray: SunAndMoonData[] = [];
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

  return (
    <div className="astronomy-display">
      <h1>Astronomy 🌌</h1>

      <div className="forecast-table-wrapper">
        {sunAndMoonData.length > 0 ? (
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
                {milkyWayData.map((day: MilkyWayData, index: number) => {
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
                {sunAndMoonData.map((day: SunAndMoonData, index: number) => {
                  return (
                    <td key={index} className="forecast-table-cell">
                      <span className="forecast-table-bold">Sunrise: </span>
                      <p className="forecast-detail-p">{day.sunrise}</p>
                      <span className="forecast-table-bold">Sunset: </span>
                      <p className="forecast-detail-p">{day.sunset}</p>
                      <span className="forecast-table-bold">
                        Best star viewing times:{' '}
                      </span>
                      {day.darkWindows.map((time: string[], index: number) => {
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
        ) : (
          <div className="loader-wrapper">
            <div className="loader">
              <div className="loader-inner">
                <div className="loader-line-wrap">
                  <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                  <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                  <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                  <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                  <div className="loader-line"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AstronomyDisplay;
