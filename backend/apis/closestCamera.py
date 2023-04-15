from dashboard.models import Camera
import math

# use the haversine formula to calculate the distance between two points
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth's radius in km
    lat1_rad, lon1_rad = math.radians(lat1), math.radians(lon1)
    lat2_rad, lon2_rad = math.radians(lat2), math.radians(lon2)
    dlat, dlon = lat2_rad - lat1_rad, lon2_rad - lon1_rad
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

# API endpoint that receives a location and finds the url of the camera closest to it in the database
def find_closest_camera(lat, lon):
  # get a list of all the camera dictionaries in the database
  cameras_list = list(Camera.objects.all().values())

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

  return closest_camera["url"]
