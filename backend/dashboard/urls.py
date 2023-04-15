from django.urls import path
from . import views

urlpatterns = [
    path("forecast/<str:lat>,<str:lon>/", views.weather_forecast, name="weather_forecast"),
    path("closestCamera/<str:location>/", views.get_camera, name="get_camera"),
]
