from rest_framework import status, generics, viewsets
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .serializers import (
    TripSerializer,
    LocationSerializer,
)
from .models import Trip, Location
from apis.weather import fetch_weather_data
from apis.astronomy import fetch_astronomy_data
from apis.closestCamera import find_closest_camera
from django.http import JsonResponse


class TripView(generics.ListCreateAPIView):
    serializer_class = TripSerializer
    queryset = Trip.objects.all()


class LocationView(generics.ListCreateAPIView):
    serializer_class = LocationSerializer
    queryset = Location.objects.all()


class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


@api_view(["POST"])
def register_user(request):
    username = request.data["username"]
    password = request.data["password"]
    if not (username and password):
        return Response(
            {"error": "Missing information"}, status=status.HTTP_400_BAD_REQUEST
        )
    user = User.objects.create_user(
        username=username, password=password, email="placeholder@email.com"
    )
    return Response(
        {"message": "User created successfully"}, status=status.HTTP_201_CREATED
    )


# takes in a username and password and returns a token if the user is authenticated
@csrf_exempt
@api_view(["POST"])
def login_user(request):
    username = request.data["username"]
    password = request.data["password"]
    user = authenticate(username=username, password=password)
    if user:
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "id": user.id})
    else:
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
        )


def add_location(req, trip_id):
    try:
        serializer = LocationSerializer(data=req.data)
        if serializer.is_valid():
            serializer.save(trip_id=trip_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Trip.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


# looks at the token on the request headers and returns the associated user_id
@api_view(["GET"])
def refresh_session(request):
    token_key = request.headers.get("Authorization")
    try:
        token = Token.objects.get(key=token_key)
        return Response(
            {"id": token.user_id, "token": token.key}, status=status.HTTP_200_OK
        )
    except Token.DoesNotExist:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


def get_user_trips(req, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    # get trips for the user
    trips = Trip.objects.filter(user=user)

    # serialize the data
    trips_data = []
    for trip in trips:
        # get locations for the trip
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
