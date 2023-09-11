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

export type DeleteButton = (tripId: number) => void;

export type GetWeather = (
  lat: string,
  lon: string,
  date: string
) => Promise<WeatherForecast>;

export type TripProps = {
  location: Location;
  date: string;
  camera: Camera;
  deleteButton: DeleteButton;
  getWeather: GetWeather;
};

export type InputProps = {
  onSubmit: (arg0: FormData) => void;
};

export type FormData = {
  location: string;
  lat: string;
  lon: string;
  date: string;
};

export type WeatherForecast = {
  dateInRange: boolean;
  precipBeforeTrip: boolean | null;
  forecast: [];
};
