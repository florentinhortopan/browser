"""
URL configuration for browser_app project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static
import os

def root_view(request):
    """Root view - Serve browser UI"""
    template_path = os.path.join(os.path.dirname(__file__), 'templates', 'browser', 'index.html')
    with open(template_path, 'r') as f:
        return HttpResponse(f.read(), content_type='text/html')

urlpatterns = [
    path('', root_view, name='root'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0] if settings.STATICFILES_DIRS else None)

