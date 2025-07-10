from django.urls import path

from .views import LogIn, GetStatus, PostUserReportLogger

from .views import LogIn_V1, GetStatus_V1

from .views import GetAllUsers, GetOneUser, DeleteOneUser, CreateOneUser, UpdateOneUser

urlpatterns = [
    path('login/', LogIn, name="LogIn"),
    path('loginv1/', LogIn_V1, name="LogIn_V1"),
    path('getstatus/<str:pk>', GetStatus, name="GetStatus"),
    path('getstatusv1/<str:pk>', GetStatus_V1, name="GetStatus_V1"),
    path('userreportlogger/', PostUserReportLogger, name="PostUserReportLogger"),

    path('getallusers/', GetAllUsers, name="GetAllUsers"),
    path('getoneuser/<str:pk>', GetOneUser, name="GetOneUser"),
    path('deleteoneuser/<str:pk>', DeleteOneUser, name="DeleteOneUser"),
    path('createoneuser/', CreateOneUser, name="CreateOneUser"),
    path('updateoneuser/<str:pk>', UpdateOneUser, name="UpdateOneUser"),
]