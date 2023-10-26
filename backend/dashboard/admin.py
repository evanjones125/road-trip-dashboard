from django.contrib import admin
from .models import User, Trip, Location


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["name", "email"]


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ["start_date", "end_date", "trip_name", "user"]


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = [
        "latitude",
        "longitude",
        "start_date",
        "end_date",
        "location_name",
        "trip",
    ]


# class LocationAdmin(admin.ModelAdmin):
#     list_display = ("title", "latitude", "longitude", "trip_date")


# # register models
# admin.site.register(Location, LocationAdmin)
