from django.http import HttpResponse
from django.views.generic import TemplateView

def index(request):
    return HttpResponse("Hello !!! You're at the Meraplion biteam home page")


class HomePage(TemplateView):
    template_name = 'index.html'