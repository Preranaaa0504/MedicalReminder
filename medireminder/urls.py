from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tracker.urls')),  # Adjust if your app is not called tracker
]

# Catch-all fallback to serve React index.html
urlpatterns += [
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]
