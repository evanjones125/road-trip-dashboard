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

export type Trip = {
  id: number;
  user: number;
  trip_name: string;
  start_date: string;
  end_date: string;
  locations: [];
};

export type Location = {
  id: number;
  trip: number;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  location_name: string;
};

export type DeleteTrip = (tripId: number) => void;

export type GetWeather = (
  lat: string,
  lon: string,
  date: string
) => Promise<WeatherForecast>;

export type TripGridItemProps = {
  id: number;
  tripName: string;
  startDate: string;
  endDate: string;
  deleteTrip: DeleteTrip;
  getWeather: GetWeather;
};

export type TripFormProps = {
  onSubmit: (arg0: TripFormData) => void;
};

export type TripFormData = {
  tripName: string;
  startDate: string;
  endDate: string;
  user: string;
};

export type WeatherForecast = {
  dateInRange: boolean;
  precipBeforeTrip: Array<[string, string, string]> | null;
  forecast: [];
} | void;
