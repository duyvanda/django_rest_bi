from django.urls import path
from .views import RegisterView, LoginAPIView,getProducts, getQueryParams, getProduct, addOrderItems
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name="register"),
    path('login/', LoginAPIView.as_view(), name="login"),
    path('tokenrefresh/', TokenRefreshView.as_view(), name="tokenrefresh"),
    path('products/', getProducts, name="products"),
    path('products/<str:pk>', getProduct, name="product"),
    path('params/', getQueryParams, name="getQueryParams"),
    path('createorder/', addOrderItems, name="addOrderItems"),
]