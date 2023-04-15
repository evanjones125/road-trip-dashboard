export type Location = {
  id: number;
  title: string;
  latitude: string;
  longitude: string;
  trip_date: string;
};

export type TripProps = {
  location: string;
  date: string;
};
