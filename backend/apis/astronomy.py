import requests
from typing import List
import time
from datetime import datetime, timedelta

# data from Capture the Atlas and manually inputted because I couldn't find a milky way API
milky_way_dates = {
  '2023-10-07': {
    'visibility': {
      'start': '20:32',
      'end': '22:30',
    },
    'position': 'Vertical (85°) to vertical (-75°)',
    'report': 'The milky way will be visible for a 1 hour, 58 minute window between 8:32pm and 10:30pm.',
  },
  '2023-10-14': {
    'visibility': {
      'start': '20:22',
      'end': '22:03',
    },
    'position': 'Vertical (-90°) to vertical (-75°)',
    'report': 'The milky way will be visible for a 1 hour, 40 minute window between 8:22pm and 10:03pm.',
  },
  '2023-10-21': {
    'visibility': {
      'start': '',
      'end': '',
    },
    'position': '',
    'report': 'The milky way won\'t be visible on this date :(',
  },
  '2023-10-28': {
    'visibility': {
      'start': '',
      'end': '',
    },
    'position': '',
    'report': 'The milky way won\'t be visible on this date :(',
  },
  '2023-11-04': {
    'visibility': {
      'start': '19:59',
      'end': '20:40',
    },
    'position': 'Vertical (-80°)',
    'report': 'The milky way will be visible for a 41 minute window between 7:59pm and 8:40pm.',
  },
  '2023-11-11': {
    'visibility': {
      'start': '18:53',
      'end': '19:12',
    },
    'position': 'Vertical (-75°)',
    'report': 'The milky way will be visible for a 19 minute window between 6:53pm and 7:12pm.',
  },
  '2023-11-18': {
    'visibility': {
      'start': '',
      'end': '',
    },
    'position': '',
    'report': 'The milky way won\'t be visible on this date :(',
  },
  '2023-11-25': {
    'visibility': {
      'start': '',
      'end': '',
    },
    'position': '',
    'report': 'The milky way won\'t be visible on this date :(',
  },
  '2023-12-02': {
    'visibility': {
      'start': '',
      'end': '',
    },
    'position': '',
    'report': 'The milky way won\'t be visible on this date :(',
  },
  '2023-12-09': {
    'visibility': {
      'start': '',
      'end': '',
    },
    'position': '',
    'report': 'The milky way won\'t be visible on this date :(',
  },
  '2023-12-16': {
    'visibility': {
      'start': '',
      'end': '',
    },
    'position': '',
    'report': 'The milky way won\'t be visible on this date :(',
  },
  '2023-12-23': {
    'visibility': {
      'start': '',
      'end': '',
    },
    'position': '',
    'report': 'The milky way won\'t be visible on this date :(',
  },
  '2023-12-30': {
    'visibility': {
      'start': '',
      'end': '',
    },
    'position': '',
    'report': 'The milky way won\'t be visible on this date :(',
  },
}

# format a datetime object into a string in 12hr time format without any leading 0s
def format_time(dt: datetime) -> str:
  return dt.strftime('%I:%M%p').lstrip('0').lower()

# look in milky_way_dates and return the corresponding object of closest date to the input date
def get_milky_way_data(date: str) -> str:
  # convert the input string to a datetime.date object
  input_date_obj = datetime.strptime(date, '%Y-%m-%d').date()

  # check if input date is out of range
  last_date_str = max(milky_way_dates.keys())
  last_date_obj = datetime.strptime(last_date_str, '%Y-%m-%d').date()
  if input_date_obj > last_date_obj + timedelta(days=7):
    return "No milky way forecast yet for this date."

  # iterate through the milky_way_dates dict to find the closest date to the input
  min_diff = None
  closest_date = None

  for date_str, data in milky_way_dates.items():
    date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
    diff = abs((input_date_obj - date_obj).days)

    if min_diff is None or diff < min_diff:
      min_diff = diff
      closest_date = date_str

  return milky_way_dates[closest_date]

# grab sun and moon data from the ipgeolocation API
def get_sun_and_moon_data(lat: str, lon: str, date: str) -> dict:
  # request for the sun and moon data for the input date
  req = f'https://api.ipgeolocation.io/astronomy?apiKey=483c6d15f0924e219b334c84ea6269c5&lat={lat}&long={lon}&date={date}'

  # request for the sun and moon data for the day after the input date (so we can find dark sky windows throughout the entire night)
  date_obj = datetime.strptime(date, '%Y-%m-%d').date()
  next_day_obj = date_obj + timedelta(days=1)
  next_day_str = next_day_obj.strftime('%Y-%m-%d')
  next_day_req = f'https://api.ipgeolocation.io/astronomy?apiKey=483c6d15f0924e219b334c84ea6269c5&lat={lat}&long={lon}&date={next_day_str}'

  # get the forecast using the url we generated
  try:
      sun_and_moon_data = requests.get(req).json()
      next_day_data = requests.get(next_day_req).json()
  except requests.RequestException:
      return {"error": "Failed to fetch cameras list"}
  
  # convert the sunrise and sunset times of the target date into datetime objects
  sunrise_time = datetime.strptime(sun_and_moon_data['sunrise'], '%H:%M')
  sunset_time = datetime.strptime(sun_and_moon_data['sunset'], '%H:%M')

  return {
    'sunrise': format_time(sunrise_time),
    'sunset': format_time(sunset_time),
    'dark_windows': find_dark_windows(sun_and_moon_data['sunset'], sun_and_moon_data['moonrise'], sun_and_moon_data['moonset'], next_day_data['sunrise'], next_day_data['moonrise'], next_day_data['moonset'])
  }

def find_dark_windows(sunset: str, moonrise_day1: str, moonset_day1: str, sunrise: str, moonrise_day2: str, moonset_day2: str) -> List[tuple]:  
  # convert all time strings into datetime objects
  sunset_time = datetime.strptime(sunset, '%H:%M')
  moonrise_day1_time = datetime.strptime(moonrise_day1, '%H:%M')
  moonset_day1_time = datetime.strptime(moonset_day1, '%H:%M')
  sunrise_time = datetime.strptime(sunrise, '%H:%M')
  moonrise_day2_time = datetime.strptime(moonrise_day2, '%H:%M')
  moonset_day2_time = datetime.strptime(moonset_day2, '%H:%M')

  dark_windows = []

  # if there's a dark window between sunset and moonrise on day 1
  if sunset_time < moonrise_day1_time:
    dark_windows.append((format_time(sunset_time), format_time(moonrise_day1_time)))

  # if there's a dark window between moonset on day 2 and sunrise on day 2
  if moonset_day2_time < sunrise_time:
    if not (moonset_day1_time < sunrise_time and moonrise_day2_time < sunrise_time):
      dark_windows.append((format_time(moonset_day2_time), format_time(sunrise_time)))

  # if moonrise and moonset are sequential on day 1
  if moonset_day1_time > moonrise_day1_time:
    # if the sunset happens after the moonset, there's a dark window from sunset until either:
    if sunset_time > moonset_day1_time:
      # sunrise if the next moonrise happens after sunrise
      if moonrise_day2_time > sunrise_time:
        dark_windows.append((format_time(sunset_time), format_time(sunrise_time)))
      # or the time of the next moonrise if not
      else:
        dark_windows.append((format_time(sunset_time), format_time(moonrise_day2_time)))

    # if the sunset happens before the moonset, there's a dark window from moonset until either:
    else:
      # sunrise if the next moonrise happens after sunrise
      if moonrise_day2_time > sunrise_time:
        dark_windows.append((format_time(moonset_day1_time), format_time(sunrise_time)))
      # or the time of the next moonrise if not
      else:
        dark_windows.append((format_time(moonset_day1_time), format_time(moonrise_day2_time)))

  return dark_windows

# for a single date, return the milky way, sun, and moon forecasts
def fetch_astronomy_data(lat: str, lon: str, date: str) -> dict:
  return {
    'milky-way': get_milky_way_data(date),
    'sun-and-moon': get_sun_and_moon_data(lat, lon, date),
  }
