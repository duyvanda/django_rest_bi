# api/routing.py
from django.urls import re_path

# Import ChatConsumer class thay vì chỉ import consumers module
from .consumers import ChatConsumer # <<< THAY ĐỔI DÒNG NÀY

websocket_urlpatterns = [
    # Sử dụng ChatConsumer.as_asgi() để chuyển đổi class consumer thành ASGI application
    re_path(r'ws/chat/$', ChatConsumer.as_asgi()), # <<< THAY ĐỔI DÒNG NÀY
]