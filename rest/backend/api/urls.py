from django.urls import path

from .views import getUrlRequest, getTinhThanh, getQuanHuyen, getPhuongXa, CreateOrder, CreateToken

from .views import FileUploadView, UploadSpreedSheetData,LogIn, ChangePass, GetStatus, PostUserReportLogger

from .views import GetAllUsers, GetOneUser, DeleteOneUser, CreateOneUser, UpdateOneUser
# from rest_framework_simplejwt.views import TokenRefreshView

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
    path('changepass/', ChangePass, name="ChangePass"),
    path('getstatus/<str:pk>', GetStatus, name="GetStatus"),
    path('userreportlogger/', PostUserReportLogger, name="PostUserReportLogger"),
    path('getallusers/', GetAllUsers, name="GetAllUsers"),
    path('getoneuser/<str:pk>', GetOneUser, name="GetOneUser"),
    path('deleteoneuser/<str:pk>', DeleteOneUser, name="DeleteOneUser"),
    path('createoneuser/', CreateOneUser, name="CreateOneUser"),
    path('updateoneuser/<str:pk>', UpdateOneUser, name="UpdateOneUser"),

]

# path('register/', RegisterView.as_view(), name="register"),
# path('login/', LoginAPIView.as_view(), name="login"),
# path('tokenrefresh/', TokenRefreshView.as_view(), name="tokenrefresh"),
# path('products/', getProducts, name="products"),
# path('products/<str:pk>', getProduct, name="product"),
# path('params/', getQueryParams, name="getQueryParams"),
# path('createorder/', addOrderItems, name="addOrderItems"),