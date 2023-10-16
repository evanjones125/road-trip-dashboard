from django.urls import path
from . import views

urlpatterns = [
    path("weatherForecast/<str:lat>,<str:lon>,<str:date>/", views.weather_forecast, name="weather_forecast"),
    path("astronomyForecast/<str:date>/", views.astronomy, name="astronomy"),
    path("closestCamera/<str:lat>,<str:lon>/", views.get_camera, name="get_camera"),
]
