from django.urls import path
from .views import getQueryParams, getAllVipPlus

urlpatterns = [
    path('params/', getQueryParams, name="getQueryParams"),
    path('allvipplus/', getAllVipPlus, name="getAllVipPlus"),
]