""" backend URL Configuration """

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from dashboard import views

router = routers.DefaultRouter()
router.register(r"users", views.UserView, "user")
router.register(r"trips", views.TripView, "trip")
router.register(r"locations", views.LocationView, "location")

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "user/<int:user_id>/trips/",
        views.get_user_trips,
        name="get_user_trips",
    ),
    # get trip locations
    path("api/", include(router.urls)),
    path("api/weather/", include("dashboard.urls")),
    path("api/astronomy/", include("dashboard.urls")),
    path("api/getCamera/", include("dashboard.urls")),
]

urlpatterns += router.urls
