from django.contrib import admin
from .models import Location, Camera


class LocationAdmin(admin.ModelAdmin):
    list_display = ("title", "latitude", "longitude", "trip_date")


class CameraAdmin(admin.ModelAdmin):
    list_display = ("name", "agency", "latitude", "longitude", "url")


# register models
admin.site.register(Location, LocationAdmin)
admin.site.register(Camera, CameraAdmin)
