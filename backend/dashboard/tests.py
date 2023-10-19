from django.test import TestCase
from apis.astronomy import find_dark_windows

class FindDarkWindowsTests(TestCase):
  def test_dark_window_between_sunset_and_moonrise1(self):
                            # sunset, moonrise1, moonset1, sunrise, moonrise2, moonset2
    result = find_dark_windows('18:00', '23:00', '08:00', '06:05', '23:50', '8:50')
    self.assertEqual(result, [('18:00', '23:00')])

  def test_dark_window_between_sunset_and_moonrise2(self):
                            # sunset, moonrise1, moonset1, sunrise, moonrise2, moonset2
    result = find_dark_windows('17:19', '05:33', '16:08', '07:25', '06:44', '16:44')
    self.assertEqual(result, [('17:19', '06:44')])

  def test_dark_window_between_moonset1_and_moonrise2(self):
                            # sunset, moonrise1, moonset1, sunrise, moonrise2, moonset2
    result = find_dark_windows('17:19', '07:33', '18:08', '07:25', '06:44', '16:44')
    self.assertEqual(result, [('18:08', '06:44')])

  def test_dark_window_between_moonset1_and_sunrise(self):
                            # sunset, moonrise1, moonset1, sunrise, moonrise2, moonset2
    result = find_dark_windows('17:19', '07:33', '18:08', '07:25', '07:44', '17:44')
    self.assertEqual(result, [('18:08', '07:25')])

  def test_dark_window_between_moonset1_and_sunrise(self):
                            # sunset, moonrise1, moonset1, sunrise, moonrise2, moonset2
    result = find_dark_windows('17:19', '16:08', '05:33', '07:25', '16:44', '06:44')
    self.assertEqual(result, [('06:44', '07:25')])

  def test_no_dark_window(self):
                              # sunset, moonrise1, moonset1, sunrise, moonrise2, moonset2
    result = find_dark_windows('18:00', '17:00', '06:10', '06:05', '07:00', '19:20')
    self.assertEqual(result, [])

  def test_complete_darkness(self):
                            # sunset, moonrise1, moonset1, sunrise, moonrise2, moonset2
    result = find_dark_windows('18:00', '08:05', '17:55', '06:05', '07:00', '17:20')
    self.assertEqual(result, [('18:00', '06:05')])

  def test_multiple_windows(self):
                            # sunset, moonrise1, moonset1, sunrise, moonrise2, moonset2
    result = find_dark_windows('17:30', '18:00', '07:10', '07:40', '15:45', '06:45')
    self.assertEqual(result, [('17:30', '18:00'), ('06:45', '07:40')])