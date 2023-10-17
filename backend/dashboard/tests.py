from django.test import TestCase
from apis.astronomy import find_dark_windows

class FindDarkWindowsTests(TestCase):
  def test_dark_window_after_sunset_before_moonrise(self):
    result = find_dark_windows('18:00', '23:00', '08:00', '06:05', '23:50')
    self.assertEqual(result, [('18:00', '23:00')])

  def test_dark_window_after_moonset_before_sunrise(self):
    result = find_dark_windows('17:19', '10:35', '20:15', '07:42', '11:17')
    self.assertEqual(result, [('20:15', '07:42')])

  def test_no_dark_window(self):
    result = find_dark_windows('18:00', '17:00', '06:10', '06:05', '07:00')
    self.assertEqual(result, [])

  def test_complete_darkness(self):
    result = find_dark_windows('18:00', None, None, '06:05', '07:00')
    self.assertEqual(result, [('18:00', '06:05')])