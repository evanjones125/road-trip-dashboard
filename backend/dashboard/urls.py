from django.urls import path
from . import views

urlpatterns = [
    path("forecast/<str:lat>,<str:long>/", views.weather_forecast, name="weather_forecast"),
]
