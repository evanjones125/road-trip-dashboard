from rest_framework import serializers
from .models import Location, Camera


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ("id", "title", "latitude", "longitude", "trip_date")


class CameraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Camera
        fields = ("id", "name", "agency", "latitude", "longitude", "url")
