from django.db import models

class Location(models.Model):
    title = models.CharField(max_length=120, default='title')
    latitude = models.DecimalField(max_digits=8, decimal_places=6, default=0.000000)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, default=0.000000)
    trip_date = models.DateField()

    def _str_(self):
        return self.title
    
class Camera(models.Model):
    name = models.CharField(max_length=120, default='name')
    agency = models.CharField(max_length=120, default='agency')
    latitude = models.DecimalField(max_digits=8, decimal_places=6, default=0.000000)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, default=0.000000)
    url = models.CharField(max_length=120, default='null')

    def _str_(self):
        return self.title
    
class User(models.Model):
    
    
    def _str_(self):
        return self.title