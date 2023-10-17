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
  req = f'https://api.ipgeolocation.io/astronomy?apiKey=483c6d15f0924e219b334c84ea6269c5&lat={lat}&long={lon}&date={date}'

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

#   print(sun_and_moon_data)
#   print(next_day_data)

  return {
    'sunrise': f"{sun_and_moon_data['sunrise']}am",
    'sunset': f"{time.strftime('%I:%M %p', time.strptime(sun_and_moon_data['sunset'], '%H:%M'))[0:5]}pm",
    'moonrise': sun_and_moon_data['moonrise'],
    'moonset': sun_and_moon_data['moonset'],
    'dark_windows': find_dark_windows(sun_and_moon_data['sunset'], sun_and_moon_data['moonrise'], sun_and_moon_data['moonset'], next_day_data['sunrise'], next_day_data['moonrise'])
  }

def find_dark_windows(sunset1, moonrise1, moonset1, sunrise2, moonrise2):
  # convert time strings to datetime.time objects
  sunset1_time = datetime.strptime(sunset1, '%H:%M').time()
  moonrise1_time = datetime.strptime(moonrise1, '%H:%M').time() if moonrise1 else None
  moonset1_time = datetime.strptime(moonset1, '%H:%M').time() if moonset1 else None
  sunrise2_time = datetime.strptime(sunrise2, '%H:%M').time()
  moonrise2_time = datetime.strptime(moonrise2, '%H:%M').time() if moonrise2 else None

  print([sunset1, moonrise1, moonset1, sunrise2, moonrise2])
  windows = []

  # if the moon rises after sunset on day 1 but before midnight
  if moonrise1_time and (moonrise1_time > sunset1_time) and (moonrise1_time.hour < 24):
    windows.append((sunset1_time.strftime('%H:%M'), moonrise1_time.strftime('%H:%M')))
    
  # if the moon is already in the sky at sunset on day 1 and then sets before sunrise on day 2
  elif moonset1_time and (moonset1_time > sunset1_time) and (moonset1_time < sunrise2_time):
    windows.append((moonset1_time.strftime('%H:%M'), sunrise2_time.strftime('%H:%M')))

  # if the next moonrise is after sunrise on day 2
  elif moonrise2_time and (moonrise2_time > sunrise2_time):
    windows.append((sunset1_time.strftime('%H:%M'), sunrise2_time.strftime('%H:%M')))

  return windows

# print(find_dark_windows('18:00', '23:00', '08:00', '06:05', '23:50'))
# print(find_dark_windows('17:19', '10:35', '20:15', '07:42', '11:17'))

# for a single date, return the milky way, sun, and moon forecasts
def fetch_astronomy_data(lat: str, lon: str, date: str) -> dict:
  return {
    'milky-way': get_milky_way_data(date),
    'sun-and-moon': get_sun_and_moon_data(lat, lon, date),
  }
