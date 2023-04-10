import requests

def fetch_weather_data(lat, lon):
    # find the url of the closest NWS station
    req = f'https://api.weather.gov/points/{lat},{lon}'
    headers = {
        "User-Agent": "trip-dashboard (me@evanjones.space)",
        "Accept": "application/json",
    }
    url = requests.get(req, headers=headers).json()['properties']['forecast']

    # get the data from the nearest NWS station
    response = requests.get(url)
    response.raise_for_status
    return response.json()
