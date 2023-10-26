from rest_framework import serializers
from .models import User, Trip, Location


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = (
            "id",
            "latitude",
            "longitude",
            "start_date",
            "end_date",
            "location_name",
            "trip",
        )


class TripSerializer(serializers.ModelSerializer):
    locations = LocationSerializer(many=True, read_only=True)

    class Meta:
        model = Trip
        fields = ("id", "start_date", "end_date", "trip_name", "user", "locations")


class UserSerializer(serializers.ModelSerializer):
    trips = TripSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ("id", "name", "email", "trips")
