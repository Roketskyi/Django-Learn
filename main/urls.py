from django.urls import path
from .views import (
    IndexView,
    AboutView,
    NewsDetailView,
    NewsListView,
    UserLoginView,
    UserLogoutView,
    UserRegisterView,
    ForgotPasswordView,
    VerifyCodeView,
    AdminPanelView,
    GetUsersView,
    GetUserView,
    DeleteUserView,
    UpdateUserView,
)

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
<<<<<<< HEAD
    path('', IndexView.as_view(), name='home'),
    path('about/', AboutView.as_view(), name='about'),
    path('news/<int:pk>/', NewsDetailView.as_view(), name='news_detail'),
    path('news/', NewsListView.as_view(), name='news_list'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='user_logout'),
    path('register/', UserRegisterView.as_view(), name='user_register'),

    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('verify-code/', VerifyCodeView.as_view(), name='verify_code'),

    path('admin-panel/', AdminPanelView.as_view(), name='admin_panel'),
    path('get-users/', GetUsersView.as_view(), name='get_users'),
    path('get-user/<int:user_id>/', GetUserView.as_view(), name='get_user'),
    path('delete-user/<int:user_id>/', DeleteUserView.as_view(), name='delete_user'),
    path('update-user/<int:user_id>/', UpdateUserView.as_view(), name='update_user'),
=======
    path('', views.index, name='home'),
    path('about/', views.about, name='about'),
    path('news/<int:pk>/', views.news_detail, name='news_detail'),
    path('news/', views.news_list, name='news_list'),
    path('register_user/', views.register_user, name='register_user'),  # Доданий URL-шлях для реєстрації
    path('login_user/', views.login_user, name='login_user'),  # Доданий URL-шлях для входу
>>>>>>> 626a9bbd3da842292e64084b620f2df2e8d3aa0e
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
