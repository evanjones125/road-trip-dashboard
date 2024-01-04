import os
import urllib.request
import urllib.parse
import json
from datetime import datetime, timedelta
from typing import List, Tuple

API_BASE_URL = "https://api.ipgeolocation.io/astronomy"
API_KEY = os.environ.get("IPGEOLOCATION_API_KEY")

# cache the geolocation api response data for 1 day to avoid making too many requests
sun_and_moon_data_cache = {}

# milky way viewing data for the American Southwest from Capture the Atlas (I couldn't find a milky way API)
milky_way_dates = {
    "2024-01-06": {
        "visibility": {
            "start": "",
            "end": "",
        },
        "position": "",
        "report": "The milky way won't be visible on this date.",
    },
    "2024-01-13": {
        "visibility": {
            "start": "",
            "end": "",
        },
        "position": "",
        "report": "The milky way won't be visible on this date.",
    },
    "2024-01-20": {
        "visibility": {
            "start": "5:46am",
            "end": "6:08am",
        },
        "position": "Arch (10deg)",
        "report": "The milky way will be visible for a 21 minute window between 5:46am and 6:08am. The galactic center will be visible in the same window.",
    },
    "2024-01-27": {
        "visibility": {
            "start": "5:18am",
            "end": "6:05am",
        },
        "position": "",
        "report": "The milky way will be visible for a 46 minute window between 5:18am and 6:05am.",
    },
    "2024-02-03": {
        "visibility": {
            "start": "4:51am",
            "end": "6:00am",
        },
        "position": "",
        "report": "The milky way will be visible for a 1 hour, 9 minute window between 4:51am and 6:00am.",
    },
    "2024-02-10": {
        "visibility": {
            "start": "4:23am",
            "end": "5:54am",
        },
        "position": "Arch (10deg) - Arch (25deg)",
        "report": "The milky way will be visible for a 1 hour, 30 minute window between 4:23am and 5:54am. The galactic center will be visible in the same window.",
    },
    "2024-02-17": {
        "visibility": {
            "start": "3:56am",
            "end": "5:47am",
        },
        "position": "Arch (10deg) - Arch (30deg)",
        "report": "The milky way will be visible for a 1 hour, 51 minute window between 3:56am and 5:47am. The galactic center will be visible in the same window.",
    },
    "2024-02-24": {
        "visibility": {
            "start": "3:28am",
            "end": "5:39am",
        },
        "position": "",
        "report": "The milky way will be visible for a 2 hour, 11 minute window between 3:28am and 5:39am.",
    },
    "2024-03-02": {
        "visibility": {
            "start": "3:01am",
            "end": "5:29am",
        },
        "position": "Vertical (-75deg)",
        "report": "The milky way will be visible for a 2 hour, 28 minute window between 3:01am and 5:29am.",
    },
    "2024-03-09": {
        "visibility": {
            "start": "3:33am",
            "end": "6:19am",
        },
        "position": "Arch (10deg) - Arch (40deg)",
        "report": "The milky way will be visible for a 2 hour, 46 minute window between 3:33am and 6:19am. The galactic center will be visible in the same window.",
    },
    "2024-03-16": {
        "visibility": {
            "start": "3:06am",
            "end": "6:09am",
        },
        "position": "Arch (15deg) - Arch (45deg)",
        "report": "The milky way will be visible for a 3 hour, 3 minute window between 3:06am and 6:09am. The galactic center will be visible from 3:24am to 6:09am.",
    },
    "2024-03-23": {
        "visibility": {
            "start": "2:38am",
            "end": "5:58am",
        },
        "position": "",
        "report": "The milky way will be visible for a 3 hour, 20 minute window between 2:38am and 5:58am.",
    },
    "2024-03-30": {
        "visibility": {
            "start": "2:11am",
            "end": "5:46am",
        },
        "position": "",
        "report": "The milky way will be visible for a 3 hour, 35 minute window between 2:11am and 5:46am.",
    },
    "2024-04-06": {
        "visibility": {
            "start": "1:43am",
            "end": "5:34am",
        },
        "position": "Arch (10deg) - Arch (55deg)",
        "report": "The milky way will be visible for a 3 hour, 51 minute window between 1:43am and 5:34am. The galactic center will be visible in the same window. This will be one of the best nights to view the milky way in 2024!",
    },
    "2024-04-13": {
        "visibility": {
            "start": "1:15am",
            "end": "5:23am",
        },
        "position": "Arch (10deg) - Arch (55deg)",
        "report": "The milky way will be visible for a 4 hour, 8 minute window between 1:15am and 5:23am. The galactic center will be visible in the same window. This will be one of the best nights to view the milky way in 2024!",
    },
    "2024-04-20": {
        "visibility": {
            "start": "12:47am",
            "end": "5:11am",
        },
        "position": "",
        "report": "The milky way will be visible for a 4 hour, 24 minute window between 12:47am and 5:11am.",
    },
    "2024-04-27": {
        "visibility": {
            "start": "12:19am",
            "end": "5:00am",
        },
        "position": "Arch (10deg)",
        "report": "The milky way will be visible for a 4 hour, 41 minute window between 12:19am and 5:00am. The galactic center will be visible from 12:20am to 12:32am.",
    },
    "2024-05-04": {
        "visibility": {
            "start": "11:51pm",
            "end": "4:49am",
        },
        "position": "Arch (10deg) - Arch (65deg)",
        "report": "The milky way will be visible for a 4 hour, 58 minute window between 11:51pm and 4:49am. The galactic center will be visible in the same window. This will be one of the best nights to view the milky way in 2024!",
    },
    "2024-05-11": {
        "visibility": {
            "start": "11:23pm",
            "end": "4:39am",
        },
        "position": "Arch (10deg) - Arch (70deg)",
        "report": "The milky way will be visible for a 5 hour, 16 minute window between 11:23pm and 4:39am. The galactic center will be visible in the same window. This will be one of the best nights to view the milky way in 2024!",
    },
    "2024-05-18": {
        "visibility": {
            "start": "10:55pm",
            "end": "4:28am",
        },
        "position": "Vertical (70deg)",
        "report": "The milky way will be visible for a 5 hour, 33 minute window between 10:55pm and 4:28am. The galactic center will be visible from 4:10am to 4:31am.",
    },
    "2024-05-25": {
        "visibility": {
            "start": "10:30pm",
            "end": "4:24am",
        },
        "position": "Arch (10deg)",
        "report": "The milky way will be visible for a 5 hour, 54 minute window between 10:30pm and 4:24am. The galactic center will be visible from 10:30pm to 11:24pm.",
    },
    "2024-06-01": {
        "visibility": {
            "start": "10:36pm",
            "end": "4:19am",
        },
        "position": "Arch (15deg) - Vertical (80deg)",
        "report": "The milky way will be visible for a 5 hour, 43 minute window between 10:36pm and 4:19am. The galactic center will be visible in the same window. This will be one of the best nights to view the milky way in 2024!",
    },
    "2024-06-08": {
        "visibility": {
            "start": "10:42pm",
            "end": "4:16am",
        },
        "position": "Arch (20deg) - Vertical (85deg)",
        "report": "The milky way will be visible for a 5 hour, 33 minute window between 10:42pm and 4:16am. The galactic center will be visible in the same window. This will be one of the best nights to view the milky way in 2024!",
    },
    "2024-06-15": {
        "visibility": {
            "start": "10:48pm",
            "end": "4:14am",
        },
        "position": "Vertical (75deg) - Vertical (-90deg)",
        "report": "The milky way will be visible for a 5 hour, 26 minute window between 10:48pm and 4:14am. The galactic center will be visible from 2:34am to 4:15am.",
    },
    "2024-06-22": {
        "visibility": {
            "start": "10:48pm",
            "end": "4:16am",
        },
        "position": "",
        "report": "The milky way will be visible for a 5 hour, 28 minute window between 10:48pm and 4:16am.",
    },
    "2024-06-29": {
        "visibility": {
            "start": "10:48pm",
            "end": "4:19am",
        },
        "position": "Arch (40deg) - Vertical (75deg)",
        "report": "The milky way will be visible for a 5 hour, 31 minute window between 10:48pm and 4:19am. The galactic center will be visible from 10:48pm to 1:58am. This will be one of the best nights to view the milky way in 2024!",
    },
    "2024-07-06": {
        "visibility": {
            "start": "10:48pm",
            "end": "4:24am",
        },
        "position": "Arch (45deg) - Vertical (-75eg)",
        "report": "The milky way will be visible for a 5 hour, 36 minute window between 10:48pm and 4:24am. The galactic center will be visible in the same window. This will be one of the best nights to view the milky way in 2024!",
    },
    "2024-07-13": {
        "visibility": {
            "start": "10:40pm",
            "end": "4:05am",
        },
        "position": "Vertical (75deg) - Vertical (-75deg)",
        "report": "The milky way will be visible for a 5 hour, 25 minute window between 10:40pm and 4:05am. The galactic center will be visible from 12:59am to 4:05am. This will be one of the best nights to view the milky way in 2024!",
    },
    "2024-07-20": {
        "visibility": {
            "start": "10:32pm",
            "end": "3:47am",
        },
        "position": "",
        "report": "The milky way will be visible for a 5 hour, 15 minute window between 10:32pm and 3:47am.",
    },
    "2024-07-27": {
        "visibility": {
            "start": "10:25pm",
            "end": "3:10am",
        },
        "position": "Arch (55deg) - Vertical (80deg)",
        "report": "The milky way will be visible for a 4 hour, 45 minute window between 10:25pm and 3:10am. The galactic center will be visible from 10:25pm to 12:31am.",
    },
    "2024-07-29": {
        "visibility": {
            "start": "10:23pm",
            "end": "3:05am",
        },
        "position": "Vertical (60deg) - Vertical (-75deg)",
        "report": "The milky way will be visible for a 4 hour, 42 minute window between 10:23pm and 3:05am. The galactic center will be visible in the same window. This will be one of the best nights to view the milky way in 2024!",
    },
    "2024-08-03": {
        "visibility": {
            "start": "10:16pm",
            "end": "2:43am",
        },
        "position": "Vertical (60deg) - Vertical (-75deg)",
        "report": "The milky way will be visible for a 4 hour, 26 minute window between 10:16pm and 2:43am. The galactic center will be visible in the same window. This will be one of the best nights to view the milky way in 2024!",
    },
    "2024-08-10": {
        "visibility": {
            "start": "10:08pm",
            "end": "2:20am",
        },
        "position": "Vertical (80deg) - Vertical (-75deg)",
        "report": "The milky way will be visible for a 4 hour, 12 minute window between 10:08pm and 2:20am. The galactic center will be visible from 10:25pm to 12:31am.",
    },
    "2024-08-17": {
        "visibility": {
            "start": "9:54m",
            "end": "1:48am",
        },
        "position": "Vertical (80deg) - Vertical (-75deg)",
        "report": "The milky way will be visible for a 3 hour, 54 minute window between 9:54m and 1:48am.",
    },
    "2024-08-24": {
        "visibility": {
            "start": "9:43pm",
            "end": "1:20am",
        },
        "position": "Vertical (70deg) - Vertical (85deg)",
        "report": "The milky way will be visible for a 3 hour, 37 minute window between 9:43pm and 1:20am. The galactic center will be visible from 9:43pm to 11:05pm.",
    },
    "2024-08-31": {
        "visibility": {
            "start": "9:30pm",
            "end": "12:50am",
        },
        "position": "Vertical (75deg) - Vertical (-75deg)",
        "report": "The milky way will be visible for a 3 hour, 20 minute window between 9:30pm and 12:50am. The galactic center will be visible in the same window. This will be one of the best nights to view the milky way in 2024!",
    },
    "2024-09-07": {
        "visibility": {
            "start": "9:15pm",
            "end": "12:20am",
        },
        "position": "Vertical (75deg) - Vertical (-75deg)",
        "report": "The milky way will be visible for a 3 hour, 5 minute window between 9:15pm and 12:20am. The galactic center will be visible in the same window. This will be one of the best nights to view the milky way in 2024!",
    },
    "2024-09-14": {
        "visibility": {
            "start": "9:07pm",
            "end": "11:58pm",
        },
        "position": "",
        "report": "The milky way will be visible for a 2 hour, 51 minute window between 9:07pm and 11:58pm.",
    },
    "2024-09-21": {
        "visibility": {
            "start": "8:57pm",
            "end": "11:37pm",
        },
        "position": "Vertical (80deg)",
        "report": "The milky way will be visible for a 2 hour, 40 minute window between 8:57pm and 11:37pm. The galactic center will be visible from 8:57pm to 9:39pm.",
    },
    "2024-09-28": {
        "visibility": {
            "start": "8:44pm",
            "end": "11:03pm",
        },
        "position": "Vertical (85deg) - Vertical (-75deg)",
        "report": "The milky way will be visible for a 2 hour, 19 minute window between 8:44pm and 11:03pm. The galactic center will be visible in the same window.",
    },
    "2024-10-05": {
        "visibility": {
            "start": "8:30pm",
            "end": "10:28pm",
        },
        "position": "Vertical (85deg) - Vertical (-75deg)",
        "report": "The milky way will be visible for a 1 hour, 58 minute window between 8:30pm and 10:28pm. The galactic center will be visible in the same window.",
    },
    "2024-10-12": {
        "visibility": {
            "start": "8:24pm",
            "end": "10:07pm",
        },
        "position": "",
        "report": "The milky way will be visible for a 1 hour, 43 minute window between 8:24pm and 10:07pm.",
    },
    "2024-10-19": {
        "visibility": {
            "start": "8:16pm",
            "end": "9:47pm",
        },
        "position": "",
        "report": "The milky way will be visible for a 1 hour, 31 minute window between 8:16pm and 9:47pm.",
    },
    "2024-10-26": {
        "visibility": {
            "start": "8:07pm",
            "end": "9:12pm",
        },
        "position": "Vertical (-85deg)",
        "report": "The milky way will be visible for a 1 hour, 5 minute window between 8:07pm and 9:12pm. The galactic center will be visible in the same window.",
    },
    "2024-11-02": {
        "visibility": {
            "start": "7:58pm",
            "end": "8:37pm",
        },
        "position": "Vertical (-80deg)",
        "report": "The milky way will be visible for a 39 minute window between 7:58pm and 8:37pm. The galactic center will be visible in the same window.",
    },
    "2024-11-09": {
        "visibility": {
            "start": "6:54pm",
            "end": "7:17pm",
        },
        "position": "",
        "report": "The milky way will be visible for a 23 minute window between 6:54pm and 7:17pm.",
    },
    "2024-11-16": {
        "visibility": {
            "start": "",
            "end": "",
        },
        "position": "",
        "report": "The milky way won't be visible on this date.",
    },
    "2024-11-23": {
        "visibility": {
            "start": "",
            "end": "",
        },
        "position": "",
        "report": "The milky way won't be visible on this date.",
    },
    "2024-11-30": {
        "visibility": {
            "start": "",
            "end": "",
        },
        "position": "",
        "report": "The milky way won't be visible on this date.",
    },
    "2024-12-07": {
        "visibility": {
            "start": "",
            "end": "",
        },
        "position": "",
        "report": "The milky way won't be visible on this date.",
    },
    "2024-12-14": {
        "visibility": {
            "start": "",
            "end": "",
        },
        "position": "",
        "report": "The milky way won't be visible on this date.",
    },
    "2024-12-21": {
        "visibility": {
            "start": "",
            "end": "",
        },
        "position": "",
        "report": "The milky way won't be visible on this date.",
    },
    "2024-12-28": {
        "visibility": {
            "start": "",
            "end": "",
        },
        "position": "",
        "report": "The milky way won't be visible on this date.",
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
        url = f"{API_BASE_URL}?{urllib.parse.urlencode(params)}"
        with urllib.request.urlopen(url) as response:
            sun_and_moon_data = json.loads(response.read())

        params["date"] = (
            datetime.strptime(date, "%Y-%m-%d") + timedelta(days=1)
        ).strftime("%Y-%m-%d")
        url = f"{API_BASE_URL}?{urllib.parse.urlencode(params)}"
        with urllib.request.urlopen(url) as response:
            next_day_data = json.loads(response.read())

    except urllib.error.URLError as e:
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
