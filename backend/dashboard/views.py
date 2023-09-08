from rest_framework import viewsets
from rest_framework.decorators import api_view
from .serializers import LocationSerializer, CameraSerializer
from .models import Location, Camera
from apis.weather import fetch_weather_data
from apis.closestCamera import find_closest_camera
from django.http import JsonResponse

class LocationView(viewsets.ModelViewSet):
    serializer_class = LocationSerializer
    queryset = Location.objects.all()

class CameraView(viewsets.ModelViewSet):
    serializer_class = CameraSerializer
    queryset = Camera.objects.all()

@api_view(['GET'])
def weather_forecast(req, lat, lon, date):
    try:
        data = fetch_weather_data(lat, lon, date)
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
def get_camera(req, lat, lon):
    try:
        closest_camera = find_closest_camera(lat, lon)
        response_data = {'camera_obj': closest_camera}
        return JsonResponse(response_data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)