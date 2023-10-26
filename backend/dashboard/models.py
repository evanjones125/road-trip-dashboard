from django.db import models


class User(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name


class Trip(models.Model):
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    trip_name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="trips")

    def __str__(self):
        return self.trip_name


class Location(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    location_name = models.CharField(max_length=255)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="locations")

    def __str__(self):
        return self.location_name
