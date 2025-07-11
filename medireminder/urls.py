from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('tracker.urls')),  # Include tracker URLs at root
]

# Catch-all fallback to serve React index.html for unmatched routes
urlpatterns += [
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]