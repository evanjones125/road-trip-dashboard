""" backend URL Configuration """

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from dashboard import views

router = routers.DefaultRouter()
router.register(r'locations', views.LocationView, 'location')
router.register(r'cameras', views.CameraView, 'camera')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/weather/', include('dashboard.urls')),
    path('api/getCamera/', include('dashboard.urls')),
]
