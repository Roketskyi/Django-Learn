from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index, name='home'),
    path('about/', views.about, name='about'),
    path('news/<int:pk>/', views.news_detail, name='news_detail'),
    path('news/', views.news_list, name='news_list'),
    path('register_user/', views.register_user, name='register_user'),  # Доданий URL-шлях для реєстрації
    path('login_user/', views.login_user, name='login_user'),  # Доданий URL-шлях для входу
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
