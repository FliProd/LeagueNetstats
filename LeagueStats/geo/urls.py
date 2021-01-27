from django.urls import path
from .views import discreteLocation

urlpatterns = [
    path('discreteLocation/', discreteLocation.as_view(), name="create_profile"),

]
