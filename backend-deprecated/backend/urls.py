""" backend URL Configuration """

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from dashboard import views
from django.conf import settings
from django.conf.urls.static import static


router = routers.DefaultRouter()
router.register(r"trips", views.TripViewSet, "trip")
router.register(r"locations", views.LocationViewSet, "location")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/register/", views.register_user, name="register_user"),
    path("api/login/", views.login_user, name="login_user"),
    path("api/refresh/", views.refresh_session, name="refresh_session"),
    path("api/trips/", views.TripView.as_view(), name="trip-list-create"),
    path(
        "user/<int:user_id>/trips/",
        views.get_user_trips,
        name="get_user_trips",
    ),
    path(
        "trips/<int:trip_id>/add_location/",
        views.add_location,
        name="add_location",
    ),
    path("api/", include(router.urls)),
    path("api/weather/", include("dashboard.urls")),
    path("api/astronomy/", include("dashboard.urls")),
    path("api/getCamera/", include("dashboard.urls")),
]

urlpatterns += router.urls
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
