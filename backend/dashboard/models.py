from django.db import models

# create models
class Location(models.Model):
    title = models.CharField(max_length=120, default='title')
    latitude = models.DecimalField(max_digits=8, decimal_places=6, default=0.000000)
    longitude = models.DecimalField(max_digits=8, decimal_places=6, default=0.000000)
    trip_date = models.DateField()

    def _str_(self):
        return self.title