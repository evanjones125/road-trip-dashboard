from django.db import models
from django.contrib.auth.models import User


class Trip(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="trips", null=True
    )
    trip_name = models.CharField(max_length=255)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)

    def __str__(self):
        return self.trip_name


class Location(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="locations")
    location_name = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)

    def __str__(self):
        return self.location_name


# class User(models.Model):
#     username = models.CharField(max_length=255)
#     password = models.CharField(max_length=255)

#     def __str__(self):
#         return self.name
