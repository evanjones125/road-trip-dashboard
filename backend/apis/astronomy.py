import requests
from datetime import datetime, timedelta
from typing import List, Tuple

API_BASE_URL = "https://api.ipgeolocation.io/astronomy"
# API_KEY = os.environ.get("IPGEOLOCATION_API_KEY")
API_KEY = "483c6d15f0924e219b334c84ea6269c5"

# cache the geolocation api response data for 1 day to avoid making too many requests
sun_and_moon_data_cache = {}
api_requests = 0

# milky way viewing data for the American Southwest from Capture the Atlas (I couldn't find a milky way API)
milky_way_dates = {
    "2023-10-07": {
        "visibility": {
            "start": "8:32pm",
            "end": "10:30pm",
        },
        "position": "Vertical (85deg) to vertical (-75deg)",
        "report": "The milky way will be visible for a 1 hour, 58 minute window between 8:32pm and 10:30pm.",
    },
    "2023-10-14": {
        "visibility": {
            "start": "8:22pm",
            "end": "10:03pm",
        },
        "position": "Vertical (-90deg) to vertical (-75deg)",
        "report": "The milky way will be visible for a 1 hour, 40 minute window between 8:22pm and 10:03pm.",
    },
    "2023-10-21": {
        "visibility": {
            "start": "",
            "end": "",
        },
        "position": "",
        "report": "The milky way won't be visible on this date :(",
    },
    "2023-10-28": {
        "visibility": {
            "start": "",
            "end": "",
        },
        "position": "",
        "report": "The milky way won't be visible on this date :(",
    },
    "2023-11-04": {
        "visibility": {
            "start": "7:59pm",
            "end": "8:40pm",
        },
        "position": "Vertical (-80deg)",
        "report": "The milky way will be visible for a 41 minute window between 7:59pm and 8:40pm.",
    },
    "2023-11-11": {
        "visibility": {
            "start": "6:53pm",
            "end": "7:12pm",
        },
        "position": "Vertical (-75deg)",
        "report": "The milky way will be visible for a 19 minute window between 6:53pm and 7:12pm.",
    },
    "2023-11-18": {
        "visibility": {
            "start": "",
            "end": "",
        },
        "position": "",
        "report": "The milky way won't be visible on this date :(",
    },
    "2023-11-25": {
        "visibility": {
            "start": "",
            "end": "",
        },
        "position": "",
        "report": "The milky way won't be visible on this date :(",
    },
    "2023-12-02": {
        "visibility": {
            "start": "",
            "end": "",
        },
        "position": "",
        "report": "The milky way won't be visible on this date :(",
    },
    "2023-12-09": {
        "visibility": {
            "start": "",
            "end": "",
        },
        "position": "",
        "report": "The milky way won't be visible on this date :(",
    },
    "2023-12-16": {
        "visibility": {
            "start": "",
            "end": "",
        },
        "position": "",
        "report": "The milky way won't be visible on this date :(",
    },
    "2023-12-23": {
        "visibility": {
            "start": "",
            "end": "",
        },
        "position": "",
        "report": "The milky way won't be visible on this date :(",
    },
    "2023-12-30": {
        "visibility": {
            "start": "",
            "end": "",
        },
        "position": "",
        "report": "The milky way won't be visible on this date :(",
    },
}


# format a datetime object into a string in 12hr time format without any leading 0s
def format_time(dt: datetime) -> str:
    return dt.strftime("%I:%M%p").lstrip("0").lower()


# look in milky_way_dates and return the corresponding object of closest date to the input date
def get_milky_way_data(date: str) -> str:
    # convert the input string to a datetime.date object
    input_date_obj = datetime.strptime(date, "%Y-%m-%d").date()

    # find date in milky_way_dates dict that's closest to the input date
    sorted_dates = sorted(
        milky_way_dates.keys(), key=lambda x: datetime.strptime(x, "%Y-%m-%d").date()
    )
    closest_date = min(
        sorted_dates,
        key=lambda d: abs(datetime.strptime(d, "%Y-%m-%d").date() - input_date_obj),
    )

    return milky_way_dates[closest_date]


# grab sun and moon data from the ipgeolocation API
def get_sun_and_moon_data(lat: str, lon: str, date: str) -> dict:
    global api_requests

    # check cache for corresponding input data and return it
    if sun_and_moon_data_cache.get((lat, lon, date)):
        # check if the data is older than 1 day
        if datetime.strptime(
            sun_and_moon_data_cache[(lat, lon, date)]["retrieveTime"],
            "%Y-%m-%d %H:%M:%S",
        ) < datetime.now() - timedelta(days=1):
            del sun_and_moon_data_cache[(lat, lon, date)]
            return get_sun_and_moon_data(lat, lon, date)

        return {
            "sunrise": format_time(
                datetime.strptime(
                    sun_and_moon_data_cache[(lat, lon, date)]["sunrise"], "%H:%M"
                )
            ),
            "sunset": format_time(
                datetime.strptime(
                    sun_and_moon_data_cache[(lat, lon, date)]["sunset"], "%H:%M"
                )
            ),
            "darkWindows": find_dark_windows(
                sun_and_moon_data_cache[(lat, lon, date)]["sunset"],
                sun_and_moon_data_cache[(lat, lon, date)]["moonrise"],
                sun_and_moon_data_cache[(lat, lon, date)]["moonset"],
                sun_and_moon_data_cache[(lat, lon, date)]["nextDaySunrise"],
                sun_and_moon_data_cache[(lat, lon, date)]["nextDayMoonrise"],
                sun_and_moon_data_cache[(lat, lon, date)]["nextDayMoonset"],
            ),
        }

    params = {
        "apiKey": API_KEY,
        "lat": lat,
        "long": lon,
        "date": date,
    }

    # make our requests to the geolocation API
    try:
        sun_and_moon_data = requests.get(API_BASE_URL, params=params).json()
        params["date"] = (
            datetime.strptime(date, "%Y-%m-%d") + timedelta(days=1)
        ).strftime("%Y-%m-%d")
        next_day_data = requests.get(API_BASE_URL, params=params).json()
        api_requests += 1
    except requests.RequestException as e:
        return {"error": f"Failed to fetch data: {e}"}

    # cache the data
    sun_and_moon_data_cache[(lat, lon, date)] = {
        "sunrise": sun_and_moon_data["sunrise"],
        "sunset": sun_and_moon_data["sunset"],
        "moonrise": sun_and_moon_data["moonrise"],
        "moonset": sun_and_moon_data["moonset"],
        "nextDaySunrise": next_day_data["sunrise"],
        "nextDayMoonrise": next_day_data["moonrise"],
        "nextDayMoonset": next_day_data["moonset"],
        "retrieveTime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }

    return {
        "sunrise": format_time(
            datetime.strptime(sun_and_moon_data["sunrise"], "%H:%M")
        ),
        "sunset": format_time(datetime.strptime(sun_and_moon_data["sunset"], "%H:%M")),
        "darkWindows": find_dark_windows(
            sun_and_moon_data["sunset"],
            sun_and_moon_data["moonrise"],
            sun_and_moon_data["moonset"],
            next_day_data["sunrise"],
            next_day_data["moonrise"],
            next_day_data["moonset"],
        ),
    }


# finds all the windows of time during which the sun and moon are not visibly in the sky (these are the best times to view the stars)
def find_dark_windows(*time_strings: str) -> List[Tuple[str, str]]:
    # convert all time strings into datetime objects
    times = [
        datetime.strptime(time, "%H:%M") if time != "-:-" else "-:-"
        for time in time_strings
    ]

    (
        sunset_time,
        moonrise_day1_time,
        moonset_day1_time,
        sunrise_time,
        moonrise_day2_time,
        moonset_day2_time,
    ) = times

    # assign times to the moonrise and moonset if they're not given as inputs
    if moonrise_day1_time == "-:-":
        # moonrise day 1 becomes 00:00 of the same day
        moonrise_day1_time = datetime.strptime("00:00", "%H:%M")

    if moonrise_day2_time == "-:-":
        # moonrise day 2 becomes 00:00 of the next day
        moonrise_day2_time = datetime.strptime("00:00", "%H:%M")

    if moonset_day1_time == "-:-":
        # moonset day 1 becomes 00:00 of the same day
        moonset_day1_time = datetime.strptime("00:00", "%H:%M")

    if moonset_day2_time == "-:-":
        # moonset day 2 becomes 11:59 of the next day
        moonset_day2_time = datetime.strptime("11:59", "%H:%M")

    # adjust dates for next day events by 1 day
    sunrise_time = sunrise_time + timedelta(days=1)
    moonrise_day2_time = moonrise_day2_time + timedelta(days=1)
    moonset_day2_time = moonset_day2_time + timedelta(days=1)

    dark_windows: List[Tuple[str, str]] = []

    # if there's a dark window between sunset and moonrise on day 1
    if sunset_time < moonrise_day1_time:
        dark_windows.append((format_time(sunset_time), format_time(moonrise_day1_time)))

    # if there's a dark window between moonset on day 2 and sunrise on day 2
    if moonset_day2_time < sunrise_time and not (
        moonset_day1_time < sunrise_time and moonrise_day2_time < sunrise_time
    ):
        dark_windows.append((format_time(moonset_day2_time), format_time(sunrise_time)))

    # if moonrise and moonset are sequential on day 1
    if moonset_day1_time > moonrise_day1_time:
        # if the sunset happens after the moonset, there's a dark window from sunset until either:
        if sunset_time > moonset_day1_time:
            # sunrise if the next moonrise happens after sunrise
            if moonrise_day2_time > sunrise_time:
                dark_windows.append(
                    (format_time(sunset_time), format_time(sunrise_time))
                )
            # or the time of the next moonrise if not
            else:
                dark_windows.append(
                    (format_time(sunset_time), format_time(moonrise_day2_time))
                )

        # if the sunset happens before the moonset, there's a dark window from moonset until either:
        else:
            # sunrise if the next moonrise happens after sunrise
            if moonrise_day2_time > sunrise_time:
                dark_windows.append(
                    (format_time(moonset_day1_time), format_time(sunrise_time))
                )
            # or the time of the next moonrise if not
            else:
                dark_windows.append(
                    (format_time(moonset_day1_time), format_time(moonrise_day2_time))
                )

    return dark_windows


# for a single date, return the milky way, sun, and moon forecasts
def fetch_astronomy_data(lat: str, lon: str, date: str) -> dict:
    return {
        "milkyWay": get_milky_way_data(date),
        "sunAndMoon": get_sun_and_moon_data(lat, lon, date),
    }
