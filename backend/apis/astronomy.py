import requests
from typing import List
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

def get_moon_data(date: str) -> dict:
  return {

  }

# for a single date, return the milky way, sun, and moon forecasts
def fetch_astronomy_data(date: str) -> dict:
  return {
    'milky-way': get_milky_way_data(date),
    'sun': {
      'sunrise': '',
      'sunset': '',
    },
    'moon': {
      'moonrise': '',
      'moonset': '',
    },
  }
