export type Camera = {
  Id: number;
  Organization: string;
  RoadwayName: string;
  DirectionOfTravel: string;
  Latitude: number;
  Longitude: number;
  Name: string;
  Url: string;
  Status: string;
  Description: string;
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

export type TripGridItemProps = {
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
  precipBeforeTrip: Array<[string, string, string]> | null;
  forecast: [];
};
