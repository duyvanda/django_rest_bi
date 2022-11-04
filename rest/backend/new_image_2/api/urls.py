from django.urls import path
from .views import getUrlRequest, getTinhThanh, getQuanHuyen, getPhuongXa, CreateOrder, CreateToken
# from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('params/', getUrlRequest, name="getQueryParams"),
    path('tinhthanh/', getTinhThanh, name="getTinhThanh"),
    path('quanhuyen/<str:pk>', getQuanHuyen, name="getQuanHuyen"),
    path('phuongxa/<str:pk>', getPhuongXa, name="getPhuongXa"),
    path('createorder/', CreateOrder, name="CreateOrder"),
    path('createtoken/', CreateToken, name="CreateToken"),
]

# path('register/', RegisterView.as_view(), name="register"),
# path('login/', LoginAPIView.as_view(), name="login"),
# path('tokenrefresh/', TokenRefreshView.as_view(), name="tokenrefresh"),
# path('products/', getProducts, name="products"),
# path('products/<str:pk>', getProduct, name="product"),
# path('params/', getQueryParams, name="getQueryParams"),
# path('createorder/', addOrderItems, name="addOrderItems"),