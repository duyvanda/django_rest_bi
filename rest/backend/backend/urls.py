from django.contrib import admin
from django.urls import path, include,re_path
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.conf import settings
from . import views

urlpatterns = [
    path('', views.HomePage.as_view(), name="home"),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('local/', include('api.local_urls')),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)