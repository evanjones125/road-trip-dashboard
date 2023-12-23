from rest_framework import serializers
from .models import Trip, Location
from django.contrib.auth.models import User


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
    class Meta:
        model = User
        fields = ("id", "username", "password", "trips")


# class UserLoginSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ("username", "password")
#         extra_kwargs = {"password": {"write_only": True}}
