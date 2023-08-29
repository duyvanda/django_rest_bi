from django.urls import path

from .views import GetAutoLoginKey, getUrlRequest, getTinhThanh, getQuanHuyen, getPhuongXa, CreateOrder, CreateToken, GetVNPOrders, getPKFiles

from .views import FileUploadView, UploadSpreedSheetData,LogIn, ChangePass, GetStatus, PostUserReportLogger

from .views import GetAllUsers, GetOneUser, DeleteOneUser, CreateOneUser, UpdateOneUser

from .views import GetOneKHVNP, CreateOneKHVNP, GetMap, GetRoutes, LogIn_V1, GetStatus_V1

urlpatterns = [
    path('params/', getUrlRequest, name="getQueryParams"),
    path('tinhthanh/', getTinhThanh, name="getTinhThanh"),
    path('quanhuyen/<str:pk>', getQuanHuyen, name="getQuanHuyen"),
    path('phuongxa/<str:pk>', getPhuongXa, name="getPhuongXa"),
    path('createorder/', CreateOrder, name="CreateOrder"),
    path('createtoken/', CreateToken, name="CreateToken"),
    path('uploadfile/<str:pk>', FileUploadView, name="Upload_File"),
    path('chitamform/', UploadSpreedSheetData, name="UploadSpreedSheetData"),
    path('login/', LogIn, name="LogIn"),
    path('loginv1/', LogIn_V1, name="LogIn_V1"),
    path('getstatus/<str:pk>', GetStatus, name="GetStatus"),
    path('getstatusv1/<str:pk>', GetStatus_V1, name="GetStatus_V1"),
    path('changepass/', ChangePass, name="ChangePass"),
    path('userreportlogger/', PostUserReportLogger, name="PostUserReportLogger"),
    path('getallusers/', GetAllUsers, name="GetAllUsers"),
    path('getoneuser/<str:pk>', GetOneUser, name="GetOneUser"),
    path('deleteoneuser/<str:pk>', DeleteOneUser, name="DeleteOneUser"),
    path('createoneuser/', CreateOneUser, name="CreateOneUser"),
    path('updateoneuser/<str:pk>', UpdateOneUser, name="UpdateOneUser"),
    path('getautologinkey/<str:pk>', GetAutoLoginKey, name="GetAutoLoginKey"),
    path('getpkfiles/', getPKFiles, name="getPKFiles"),
    path('getvnporders/', GetVNPOrders, name="GetVNPOrders"),
    path('getonekhvnp/<str:pk>', GetOneKHVNP, name="GetOneKHVNP"),
    path('createonekhvnp/', CreateOneKHVNP, name="CreateOneKHVNP"),
    path('map/', GetMap, name="GetMap"),
    path('routes/', GetRoutes, name="GetRoutes"),
]