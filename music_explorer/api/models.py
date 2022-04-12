from django.db import models

# Create your models here.
# fat models and thin views
class User(models.Model):
    #id ...
    id = models.CharField(max_length=50, unique=True, primary_key=True)
    name = models.CharField(max_length=50, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
