import axios from 'axios';
import { BASE_URL } from '../constants/constants';
import { handleAxiosError } from '../utils/errorHandling';

export const fetchUserTrips = async (userId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/${userId}/trips/`);
    return response.data;
  } catch (err) {
    handleAxiosError(err);
  }
};
