from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index, name='home'),
    path('about/', views.about, name='about'),
    path('news/<int:pk>/', views.news_detail, name='news_detail'),
    path('news/', views.news_list, name='news_list'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='user_logout'),
    path('register/', views.user_register, name='user_register'),

    path('admin-panel/', views.admin_panel, name='admin_panel'),
    path('get-users/', views.get_users, name='get_users'),
    path('delete-user/<int:user_id>/', views.delete_user, name='delete_user'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
