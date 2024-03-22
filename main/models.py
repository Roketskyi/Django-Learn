from django.db import models

class User(models.Model):
    login = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    email = models.EmailField()
    role = models.IntegerField()

    def __str__(self):
        return self.login
