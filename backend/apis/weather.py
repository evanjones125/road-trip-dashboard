import requests
from typing import List


# check if our date is within the National Weather Service forecast range
def is_date_in_range(date: str, forecast: List[str]) -> bool:
    return any(date in period["startTime"] for period in forecast)


# find instances of forecasted rain or snow prior to the trip date
def check_for_precip(date: str, forecast: List[str]):
    if not is_date_in_range(date, forecast):
        return None

    precip_events: List[str] = []

    for period in forecast:
        if date in period["startTime"]:
            break
        else:
            if period["probabilityOfPrecipitation"]["value"] is not None:
                precip_events.append(
                    [
                        period["name"],
                        period["startTime"][:10],
                        period["detailedForecast"],
                    ]
                )

    # for period in forecast:
    return precip_events


# gets weather data from the NWS and parses it to get a more useful object of only data we need
def fetch_weather_data(lat: str, lon: str, date: str) -> dict:
    # find the url of the closest NWS station
    req = f"https://api.weather.gov/points/{lat},{lon}"
    headers = {
        "User-Agent": "trip-dashboard (me@evanjones.space)",
        "Accept": "application/json",
    }

    # get the forecast using the url we generated
    try:
        url = requests.get(req, headers=headers).json()["properties"]["forecast"]
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException:
        return {"error": "Failed to fetch weather data"}

    # specifically grab the weather forecast portion of the NWS response
    forecast: List[str] = response.json()["properties"]["periods"]

    return {
        "dateInRange": is_date_in_range(date, forecast),
        "precipBeforeTrip": check_for_precip(date, forecast),
        "forecast": forecast,
    }
