# backend/chat/routing.py
from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/echo/$', consumers.EchoConsumer.as_asgi()),
    re_path(r'ws/voice_echo/$', consumers.EchoVoiceConsumer.as_asgi()),
]