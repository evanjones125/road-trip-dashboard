# import requests
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
    # req = f"https://api.weather.gov/points/{lat},{lon}"
    # headers = {
    #     "User-Agent": "trip-dashboard (me@evanjones.space)",
    #     "Accept": "application/json",
    # }

    # get the forecast using the url we generated
    # try:
    #     url = requests.get(req, headers=headers).json()["properties"]["forecast"]
    #     response = requests.get(url)
    #     response.raise_for_status()  # Ensure this is called
    # except requests.RequestException:
    #     return {"error": "Failed to fetch weather data"}

    # # specifically grab the weather forecast portion of the NWS response
    # forecast: List[str] = response.json()["properties"]["periods"]

    forecast = [
        {
            "number": 1,
            "name": "Today",
            "startTime": "2023-10-23T09:00:00-06:00",
            "endTime": "2023-10-23T18:00:00-06:00",
            "isDaytime": True,
            "temperature": 36,
            "temperatureUnit": "F",
            "temperatureTrend": "falling",
            "probabilityOfPrecipitation": {
                "unitCode": "wmoUnit:percent",
                "value": 30,
            },
            "dewpoint": {"unitCode": "wmoUnit:degC", "value": -6.111111111111111},
            "relativeHumidity": {"unitCode": "wmoUnit:percent", "value": 64},
            "windSpeed": "12 to 17 mph",
            "windDirection": "SSW",
            "icon": "https://api.weather.gov/icons/land/day/sct/snow,30?size=medium",
            "shortForecast": "Mostly Sunny then Chance Snow Showers",
            "detailedForecast": "A chance of snow showers after noon. Mostly sunny. High near 36, with temperatures falling to around 34 in the afternoon. South southwest wind 12 to 17 mph. Chance of precipitation is 30%. Little or no snow accumulation expected.",
        },
        {
            "number": 2,
            "name": "Tonight",
            "startTime": "2023-10-23T18:00:00-06:00",
            "endTime": "2023-10-24T06:00:00-06:00",
            "isDaytime": False,
            "temperature": 22,
            "temperatureUnit": "F",
            "temperatureTrend": None,
            "probabilityOfPrecipitation": {
                "unitCode": "wmoUnit:percent",
                "value": None,
            },
            "dewpoint": {"unitCode": "wmoUnit:degC", "value": -7.222222222222222},
            "relativeHumidity": {"unitCode": "wmoUnit:percent", "value": 76},
            "windSpeed": "7 to 10 mph",
            "windDirection": "SW",
            "icon": "https://api.weather.gov/icons/land/night/few?size=medium",
            "shortForecast": "Mostly Clear",
            "detailedForecast": "Mostly clear, with a low around 22. Southwest wind 7 to 10 mph.",
        },
        {
            "number": 3,
            "name": "Tuesday",
            "startTime": "2023-10-24T06:00:00-06:00",
            "endTime": "2023-10-24T18:00:00-06:00",
            "isDaytime": True,
            "temperature": 35,
            "temperatureUnit": "F",
            "temperatureTrend": "falling",
            "probabilityOfPrecipitation": {
                "unitCode": "wmoUnit:percent",
                "value": None,
            },
            "dewpoint": {"unitCode": "wmoUnit:degC", "value": -8.333333333333334},
            "relativeHumidity": {"unitCode": "wmoUnit:percent", "value": 66},
            "windSpeed": "10 to 17 mph",
            "windDirection": "WSW",
            "icon": "https://api.weather.gov/icons/land/day/sct?size=medium",
            "shortForecast": "Mostly Sunny",
            "detailedForecast": "Mostly sunny. High near 35, with temperatures falling to around 29 in the afternoon. West southwest wind 10 to 17 mph.",
        },
        {
            "number": 4,
            "name": "Tuesday Night",
            "startTime": "2023-10-24T18:00:00-06:00",
            "endTime": "2023-10-25T06:00:00-06:00",
            "isDaytime": False,
            "temperature": 21,
            "temperatureUnit": "F",
            "temperatureTrend": None,
            "probabilityOfPrecipitation": {
                "unitCode": "wmoUnit:percent",
                "value": None,
            },
            "dewpoint": {"unitCode": "wmoUnit:degC", "value": -8.333333333333334},
            "relativeHumidity": {"unitCode": "wmoUnit:percent", "value": 70},
            "windSpeed": "15 mph",
            "windDirection": "SW",
            "icon": "https://api.weather.gov/icons/land/night/few?size=medium",
            "shortForecast": "Mostly Clear",
            "detailedForecast": "Mostly clear, with a low around 21. Wind chill values as low as 10. Southwest wind around 15 mph.",
        },
        {
            "number": 5,
            "name": "Wednesday",
            "startTime": "2023-10-25T06:00:00-06:00",
            "endTime": "2023-10-25T18:00:00-06:00",
            "isDaytime": True,
            "temperature": 34,
            "temperatureUnit": "F",
            "temperatureTrend": None,
            "probabilityOfPrecipitation": {
                "unitCode": "wmoUnit:percent",
                "value": None,
            },
            "dewpoint": {"unitCode": "wmoUnit:degC", "value": -7.222222222222222},
            "relativeHumidity": {"unitCode": "wmoUnit:percent", "value": 65},
            "windSpeed": "20 to 30 mph",
            "windDirection": "SW",
            "icon": "https://api.weather.gov/icons/land/day/wind_few?size=medium",
            "shortForecast": "Sunny",
            "detailedForecast": "Sunny, with a high near 34. Southwest wind 20 to 30 mph, with gusts as high as 40 mph.",
        },
        {
            "number": 6,
            "name": "Wednesday Night",
            "startTime": "2023-10-25T18:00:00-06:00",
            "endTime": "2023-10-26T06:00:00-06:00",
            "isDaytime": False,
            "temperature": 21,
            "temperatureUnit": "F",
            "temperatureTrend": None,
            "probabilityOfPrecipitation": {
                "unitCode": "wmoUnit:percent",
                "value": 40,
            },
            "dewpoint": {"unitCode": "wmoUnit:degC", "value": -7.222222222222222},
            "relativeHumidity": {"unitCode": "wmoUnit:percent", "value": 76},
            "windSpeed": "20 to 28 mph",
            "windDirection": "SW",
            "icon": "https://api.weather.gov/icons/land/night/snow,20/snow,40?size=medium",
            "shortForecast": "Chance Light Snow",
            "detailedForecast": "A chance of snow. Mostly cloudy, with a low around 21. Chance of precipitation is 40%. New snow accumulation of 1 to 2 inches possible.",
        },
        {
            "number": 7,
            "name": "Thursday",
            "startTime": "2023-10-26T06:00:00-06:00",
            "endTime": "2023-10-26T18:00:00-06:00",
            "isDaytime": True,
            "temperature": 25,
            "temperatureUnit": "F",
            "temperatureTrend": None,
            "probabilityOfPrecipitation": {
                "unitCode": "wmoUnit:percent",
                "value": 70,
            },
            "dewpoint": {"unitCode": "wmoUnit:degC", "value": -6.111111111111111},
            "relativeHumidity": {"unitCode": "wmoUnit:percent", "value": 98},
            "windSpeed": "18 to 26 mph",
            "windDirection": "SW",
            "icon": "https://api.weather.gov/icons/land/day/snow,70/snow,60?size=medium",
            "shortForecast": "Snow Likely",
            "detailedForecast": "Snow likely. Mostly cloudy, with a high near 25. Chance of precipitation is 70%. New snow accumulation of 3 to 5 inches possible.",
        },
        {
            "number": 8,
            "name": "Thursday Night",
            "startTime": "2023-10-26T18:00:00-06:00",
            "endTime": "2023-10-27T06:00:00-06:00",
            "isDaytime": False,
            "temperature": 7,
            "temperatureUnit": "F",
            "temperatureTrend": None,
            "probabilityOfPrecipitation": {
                "unitCode": "wmoUnit:percent",
                "value": None,
            },
            "dewpoint": {"unitCode": "wmoUnit:degC", "value": -12.222222222222221},
            "relativeHumidity": {"unitCode": "wmoUnit:percent", "value": 79},
            "windSpeed": "12 to 22 mph",
            "windDirection": "WSW",
            "icon": "https://api.weather.gov/icons/land/night/snow?size=medium",
            "shortForecast": "Slight Chance Light Snow",
            "detailedForecast": "A slight chance of snow. Partly cloudy, with a low around 7. New snow accumulation of less than half an inch possible.",
        },
        {
            "number": 9,
            "name": "Friday",
            "startTime": "2023-10-27T06:00:00-06:00",
            "endTime": "2023-10-27T18:00:00-06:00",
            "isDaytime": True,
            "temperature": 22,
            "temperatureUnit": "F",
            "temperatureTrend": None,
            "probabilityOfPrecipitation": {
                "unitCode": "wmoUnit:percent",
                "value": None,
            },
            "dewpoint": {"unitCode": "wmoUnit:degC", "value": -7.777777777777778},
            "relativeHumidity": {"unitCode": "wmoUnit:percent", "value": 89},
            "windSpeed": "10 to 17 mph",
            "windDirection": "SW",
            "icon": "https://api.weather.gov/icons/land/day/snow?size=medium",
            "shortForecast": "Chance Light Snow",
            "detailedForecast": "A chance of snow. Partly sunny, with a high near 22. New snow accumulation of less than half an inch possible.",
        },
        {
            "number": 10,
            "name": "Friday Night",
            "startTime": "2023-10-27T18:00:00-06:00",
            "endTime": "2023-10-28T06:00:00-06:00",
            "isDaytime": False,
            "temperature": 15,
            "temperatureUnit": "F",
            "temperatureTrend": None,
            "probabilityOfPrecipitation": {
                "unitCode": "wmoUnit:percent",
                "value": None,
            },
            "dewpoint": {"unitCode": "wmoUnit:degC", "value": -8.333333333333334},
            "relativeHumidity": {"unitCode": "wmoUnit:percent", "value": 93},
            "windSpeed": "13 to 16 mph",
            "windDirection": "SW",
            "icon": "https://api.weather.gov/icons/land/night/snow?size=medium",
            "shortForecast": "Chance Light Snow",
            "detailedForecast": "A chance of snow. Mostly cloudy, with a low around 15. New snow accumulation of 1 to 3 inches possible.",
        },
        {
            "number": 11,
            "name": "Saturday",
            "startTime": "2023-10-28T06:00:00-06:00",
            "endTime": "2023-10-28T18:00:00-06:00",
            "isDaytime": True,
            "temperature": 20,
            "temperatureUnit": "F",
            "temperatureTrend": None,
            "probabilityOfPrecipitation": {
                "unitCode": "wmoUnit:percent",
                "value": None,
            },
            "dewpoint": {"unitCode": "wmoUnit:degC", "value": -7.777777777777778},
            "relativeHumidity": {"unitCode": "wmoUnit:percent", "value": 100},
            "windSpeed": "13 to 17 mph",
            "windDirection": "SW",
            "icon": "https://api.weather.gov/icons/land/day/snow?size=medium",
            "shortForecast": "Snow Likely",
            "detailedForecast": "Snow likely. Mostly cloudy, with a high near 20. New snow accumulation of 3 to 5 inches possible.",
        },
        {
            "number": 12,
            "name": "Saturday Night",
            "startTime": "2023-10-28T18:00:00-06:00",
            "endTime": "2023-10-29T06:00:00-06:00",
            "isDaytime": False,
            "temperature": 7,
            "temperatureUnit": "F",
            "temperatureTrend": None,
            "probabilityOfPrecipitation": {
                "unitCode": "wmoUnit:percent",
                "value": None,
            },
            "dewpoint": {"unitCode": "wmoUnit:degC", "value": -10},
            "relativeHumidity": {"unitCode": "wmoUnit:percent", "value": 95},
            "windSpeed": "13 to 16 mph",
            "windDirection": "W",
            "icon": "https://api.weather.gov/icons/land/night/snow?size=medium",
            "shortForecast": "Chance Snow",
            "detailedForecast": "A chance of snow. Mostly cloudy, with a low around 7. New snow accumulation of 2 to 4 inches possible.",
        },
        {
            "number": 13,
            "name": "Sunday",
            "startTime": "2023-10-29T06:00:00-06:00",
            "endTime": "2023-10-29T18:00:00-06:00",
            "isDaytime": True,
            "temperature": 12,
            "temperatureUnit": "F",
            "temperatureTrend": None,
            "probabilityOfPrecipitation": {
                "unitCode": "wmoUnit:percent",
                "value": None,
            },
            "dewpoint": {"unitCode": "wmoUnit:degC", "value": -12.777777777777779},
            "relativeHumidity": {"unitCode": "wmoUnit:percent", "value": 94},
            "windSpeed": "14 mph",
            "windDirection": "WNW",
            "icon": "https://api.weather.gov/icons/land/day/snow?size=medium",
            "shortForecast": "Chance Light Snow",
            "detailedForecast": "A chance of snow. Partly sunny, with a high near 12. New snow accumulation of 1 to 2 inches possible.",
        },
        {
            "number": 14,
            "name": "Sunday Night",
            "startTime": "2023-10-29T18:00:00-06:00",
            "endTime": "2023-10-30T06:00:00-06:00",
            "isDaytime": False,
            "temperature": 3,
            "temperatureUnit": "F",
            "temperatureTrend": None,
            "probabilityOfPrecipitation": {
                "unitCode": "wmoUnit:percent",
                "value": None,
            },
            "dewpoint": {"unitCode": "wmoUnit:degC", "value": -16.666666666666668},
            "relativeHumidity": {"unitCode": "wmoUnit:percent", "value": 81},
            "windSpeed": "13 mph",
            "windDirection": "WNW",
            "icon": "https://api.weather.gov/icons/land/night/snow?size=medium",
            "shortForecast": "Chance Light Snow",
            "detailedForecast": "A chance of snow. Mostly cloudy, with a low around 3.",
        },
    ]

    return {
        "dateInRange": is_date_in_range(date, forecast),
        "precipBeforeTrip": check_for_precip(date, forecast),
        "forecast": forecast,
    }
