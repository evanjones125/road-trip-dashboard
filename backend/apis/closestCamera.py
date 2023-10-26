import os
import requests
import math

API_KEY = os.environ.get("UDOT_API_KEY")


# use the haversine formula to calculate the distance between two points
def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371  # Earth's radius in km
    lat1_rad, lon1_rad = math.radians(lat1), math.radians(lon1)
    lat2_rad, lon2_rad = math.radians(lat2), math.radians(lon2)
    dlat, dlon = lat2_rad - lat1_rad, lon2_rad - lon1_rad
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


# API endpoint that receives a location and finds the url of the camera closest to it in the database
def find_closest_camera(lat: str, lon: str) -> dict:
    # find the url of the closest NWS station
    req = f"https://www.udottraffic.utah.gov/api/v2/get/cameras?key={API_KEY}"

    # get the forecast using the url we generated
    try:
        cameras_list = requests.get(req).json()
    except requests.RequestException:
        return {"error": "Failed to fetch cameras list"}

    # zion duck creek village
    # https://www.earthcam.com/usa/utah/duckcreekvillage/?cam=zionsummit
    # 37.452265, -112.717332

    # canyonlands island in the sky
    # http://eldesierto.org/Isky.jpg
    # 38.459967, -109.820584

    # zion canyon
    # https://www.nps.gov/webcams-zion/camera2000.jpg?1698330593466
    # 37.211684, -112.985415

    # arches entrance gate
    # https://home.nps.gov/webcams-arch/arch_traffic.jpg?1698332469836
    # 38.616517, -109.616172

    # moab castleton tower
    # http://www.perpetual-images.com/weather/netcam.jpg
    # 38.623187, -109.340467

    # monticello six shooter peak
    # http://eldesierto.org/RpeakUT.jpg
    # 38.623187, -109.340467

    # monticello abajo peak
    # http://eldesierto.org/AbajoPeak.jpg
    # 37.839561, -109.4623723

    # page, az paria plateau
    # https://www.nps.gov/webcams-glca/po1.jpg?1698334459793
    # 36.879009, -111.584474

    # ut/az border glen canyon boat ramp
    # https://www.nps.gov/webcams-glca/ww3.jpg?1698334629325
    # 37.003365, -111.499352

    # hite glen canyon ranger station
    # https://www.nps.gov/webcams-glca/hi1.jpg?1698334727991
    # 37.872822, -110.395231

    closest_camera: dict = {}
    closest_distance = float("inf")

    lat = float(lat)
    lon = float(lon)

    # loop through the database items and find the one with coordinates closest to input
    for camera in cameras_list:
        camera_lat, camera_lon = float(camera["Latitude"]), float(camera["Longitude"])
        distance = haversine(lat, lon, camera_lat, camera_lon)
        if distance < closest_distance:
            closest_distance = distance
            closest_camera = camera
    return closest_camera
