from django.contrib import admin
from .models import Trip, Location


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


# @admin.register(User)
# class UserAdmin(admin.ModelAdmin):
#     list_display = ["username", "password"]
