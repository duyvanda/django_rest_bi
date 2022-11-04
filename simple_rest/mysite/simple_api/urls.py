from django.urls import path
from .views import getQueryParams
urlpatterns = [
    path('params/', getQueryParams, name="getQueryParams"),
]