from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.http import HttpResponse

def favicon_view(request):
    return HttpResponse(status=204)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('favicon.ico', favicon_view),
    path('', include('tracker.urls')),
]

# Only catch non-favicon, non-static routes
urlpatterns += [
    re_path(r'^(?!favicon\.ico).*$', TemplateView.as_view(template_name='index.html')),
]