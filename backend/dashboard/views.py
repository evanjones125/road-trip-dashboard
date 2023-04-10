from django.shortcuts import render
from rest_framework import viewsets
from .serializers import LocationSerializer, CameraSerializer
from .models import Location, Camera

# create views
class LocationView(viewsets.ModelViewSet):
    serializer_class = LocationSerializer
    queryset = Location.objects.all()

class CameraView(viewsets.ModelViewSet):
    serializer_class = CameraSerializer
    queryset = Camera.objects.all()