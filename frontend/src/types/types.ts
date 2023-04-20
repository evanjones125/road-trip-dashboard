export type Camera = {
  id: number;
  name: string;
  agency: string;
  latitude: string;
  longitude: string;
  url: string;
};

export type Location = {
  id: number;
  title: string;
  latitude: string;
  longitude: string;
  trip_date: string;
};

export type TripProps = {
  location: any;
  date: string;
  camera: any;
  deleteButton: any;
  getWeather: any;
};

export type InputProps = {
  onSubmit: (formData: { location: string; date: string }) => void;
};

export type FormData = {
  location: string;
  lat: string;
  lon: string;
  date: string;
};
