from rest_framework import viewsets
from rest_framework.decorators import api_view
from .serializers import UserSerializer, TripSerializer, LocationSerializer
from .models import User, Trip, Location
from apis.weather import fetch_weather_data
from apis.astronomy import fetch_astronomy_data
from apis.closestCamera import find_closest_camera
from django.http import JsonResponse


class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class TripView(viewsets.ModelViewSet):
    serializer_class = TripSerializer
    queryset = Trip.objects.all()


class LocationView(viewsets.ModelViewSet):
    serializer_class = LocationSerializer
    queryset = Location.objects.all()


@api_view(["GET"])
def get_user_trips(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    # Get trips for the user
    trips = Trip.objects.filter(user=user)

    # Serialize the data (This is a simplified version; Django REST Framework can make this easier)
    trips_data = []
    for trip in trips:
        # Get locations for the trip
        locations = Location.objects.filter(trip=trip)
        locations_data = [
            {
                "id": location.id,
                "latitude": location.latitude,
                "longitude": location.longitude,
                "start_date": location.start_date,
                "end_date": location.end_date,
                "location_name": location.location_name,
                "trip": location.trip.id,
            }
            for location in locations
        ]

        trip_data = {
            "id": trip.id,
            "start_date": trip.start_date,
            "end_date": trip.end_date,
            "trip_name": trip.trip_name,
            "user": trip.user.id,
            "locations": locations_data,
        }

        trips_data.append(trip_data)

    return JsonResponse(trips_data, safe=False)


def weather_forecast(req, lat, lon, date):
    try:
        data = fetch_weather_data(lat, lon, date)
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def astronomy(req, lat, lon, date):
    try:
        data = fetch_astronomy_data(lat, lon, date)
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def get_camera(req, lat, lon):
    try:
        closest_camera = find_closest_camera(lat, lon)
        response_data = {"camera_obj": closest_camera}
        return JsonResponse(response_data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
