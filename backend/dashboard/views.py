from django.shortcuts import render
from rest_framework import viewsets
from .serializers import LocationSerializer
from .models import Location

# create views
class LocationView(viewsets.ModelViewSet):
    serializer_class = LocationSerializer
    queryset = Location.objects.all()