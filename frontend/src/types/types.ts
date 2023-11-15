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

export type DeleteLocation = (locationId: number) => void;

export type AddLocation = (formData: FormData) => void;

export type HandleBackButtonClick = () => void;

export type GetWeather = (
  lat: string,
  lon: string,
  date: string
) => Promise<WeatherForecast>;

export type TripGridProps = {
  trips: Trip[];
};

export type TripGridItemProps = {
  trip: Trip;
  getWeather: GetWeather;
};

export type TripFormData = {
  tripName: string;
  startDate: string;
  endDate: string;
  user: string;
};

export type LocationGridProps = {
  locations: LocationWithCameras[];
};

export type LocationGridItemProps = {
  location: LocationWithCameras;
};

export type LocationFormProps = {
  // onSubmit: AddLocation;
};

export type FormData = {
  locationName: string;
  tripName: string;
  latitude: string;
  longitude: string;
  user: string;
  dateRange: string[];
};

export type FormErrors = {
  locationName: string;
  tripName: string;
  latitude: string;
  longitude: string;
  dateRange: string;
};

export type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];

export type WeatherForecast = {
  dateInRange: boolean;
  precipBeforeTrip: Array<[string, string, string]> | null;
  forecast: [];
} | void;

export type InputEvent = React.ChangeEvent<HTMLInputElement>;
