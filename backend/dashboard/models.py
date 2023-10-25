from django.db import models


class User(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name


class Trip(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    trip_name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="trips")

    def __str__(self):
        return self.trip_name


class Location(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    date_range = models.DateField()
    location_name = models.CharField(max_length=255)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="locations")

    def __str__(self):
        return self.location_name


# class Location(models.Model):
#     title = models.CharField(max_length=120, default="title")
#     latitude = models.DecimalField(max_digits=8, decimal_places=6, default=0.000000)
#     longitude = models.DecimalField(max_digits=9, decimal_places=6, default=0.000000)
#     trip_date = models.DateField()

#     def _str_(self):
#         return self.title


# class User(models.Model):
#     def _str_(self):
#         return self.title
