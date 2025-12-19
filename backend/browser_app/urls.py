"""
URL configuration for browser_app project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def root_view(request):
    """Root view - API info"""
    return JsonResponse({
        'service': 'PUXA Browser API',
        'status': 'running',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health/',
            'analyze': '/api/content/analyze/',
            'fact_check': '/api/content/fact-check/',
            'defluff_score': '/api/content/defluff-score/',
        }
    })

urlpatterns = [
    path('', root_view, name='root'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

