import requests
import math
from django.http import JsonResponse
from dashboard.models import Camera

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth's radius in km
    lat1_rad, lon1_rad = math.radians(lat1), math.radians(lon1)
    lat2_rad, lon2_rad = math.radians(lat2), math.radians(lon2)
    dlat, dlon = lat2_rad - lat1_rad, lon2_rad - lon1_rad
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def find_closest_camera(lat, lon):
  # get a list of all the camera dictionaries in the database
  cameras_list = list(Camera.objects.all().values())
  # print(cameras_list)

  closest_camera = None
  closest_distance = float('inf')

  lat = float(lat)
  lon = float(lon)

  for camera in cameras_list:
      camera_lat, camera_lon = float(camera["latitude"]), float(camera["longitude"])
      distance = haversine(lat, lon, camera_lat, camera_lon)
      if distance < closest_distance:
          closest_distance = distance
          closest_camera = camera

  # print(closest_camera["url"])
  return closest_camera["url"]


  # 38.696597,-109.54006
  # take in coordinates as an input, search through the coordinates of all the cameras in the database, and output the url associated with the camera that has coordinates closest to the inputted coordinates

  # response = {"url": "http://udottraffic.utah.gov/1_devices/SR-12-MP-109.gif?rand=0.7404116890134775"}
  # return response
