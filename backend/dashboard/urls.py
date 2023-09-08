from django.urls import path
from . import views

urlpatterns = [
    path("forecast/<str:lat>,<str:lon>,<str:date>/", views.weather_forecast, name="weather_forecast"),
    path("closestCamera/<str:lat>,<str:lon>/", views.get_camera, name="get_camera"),
]
