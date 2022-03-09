from django.db import models

# Create your models here.
# fat models and thin views
class User(models.Model):
    #id ...
    email = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
