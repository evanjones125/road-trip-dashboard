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

export type LocationWithCameras = {
  id: number;
  trip: number;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  location_name: string;
  camera: Camera;
};

export type DeleteTrip = (tripId: number) => void;

export type AddTrip = (formData: TripFormData) => void;

export type OnLocationButtonClick = (trip: Trip) => void;

export type OnBackButtonClick = () => void;

export type GetWeather = (
  lat: string,
  lon: string,
  date: string
) => Promise<WeatherForecast>;

export type TripGridProps = {
  trips: Trip[];
  addTrip: AddTrip;
  deleteTrip: DeleteTrip;
  onLocationButtonClick: OnLocationButtonClick;
};

export type TripGridItemProps = {
  trip: Trip;
  deleteTrip: DeleteTrip;
  getWeather: GetWeather;
  onLocationButtonClick: OnLocationButtonClick;
};

export type TripFormProps = {
  onSubmit: AddTrip;
};

export type TripFormData = {
  tripName: string;
  startDate: string;
  endDate: string;
  user: string;
};

export type LocationGridProps = {
  locations: LocationWithCameras[] | null;
  onBackButtonClick: OnBackButtonClick;
};

export type LocationGridItemProps = {
  location: LocationWithCameras;
  onBackButtonClick: OnBackButtonClick;
};

export type WeatherForecast = {
  dateInRange: boolean;
  precipBeforeTrip: Array<[string, string, string]> | null;
  forecast: [];
} | void;
