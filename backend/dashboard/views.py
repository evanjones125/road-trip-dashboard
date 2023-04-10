from django.shortcuts import render
from rest_framework import viewsets
from .serializers import LocationSerializer, CameraSerializer
from .models import Location, Camera
from apis.weather import fetch_weather_data
from django.http import JsonResponse
from rest_framework.decorators import api_view

# create views
class LocationView(viewsets.ModelViewSet):
    serializer_class = LocationSerializer
    queryset = Location.objects.all()

class CameraView(viewsets.ModelViewSet):
    serializer_class = CameraSerializer
    queryset = Camera.objects.all()

@api_view(["GET"])
def weather_forecast(req, lat, lon):
    try:
        data = fetch_weather_data(lat, lon)
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)