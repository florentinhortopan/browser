from django.urls import path
from . import views

urlpatterns = [
    path('content/analyze/', views.AnalyzeContentView.as_view(), name='analyze_content'),
    path('content/fact-check/', views.FactCheckView.as_view(), name='fact_check'),
    path('content/defluff-score/', views.DefluffScoreView.as_view(), name='defluff_score'),
    path('health/', views.HealthView.as_view(), name='health'),
]

