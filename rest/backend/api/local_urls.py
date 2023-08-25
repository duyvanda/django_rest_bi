from django.urls import path
from .local_views import tinh, GetData, api_ds_theo_khach_example


urlpatterns = [
    path('tinh/', tinh, name="tinh"),
    path('api_ds_theo_khach_example/', api_ds_theo_khach_example, name="api_ds_theo_khach_example"),
    path('getdata/', GetData, name="GetData"),
]