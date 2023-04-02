from django.contrib import admin
from .models import Location

class LocationAdmin(admin.ModelAdmin):
    list_display = ('title', 'latitude', 'longitude', 'trip_date')

# register models
admin.site.register(Location, LocationAdmin)