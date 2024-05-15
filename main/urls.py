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
    AddUserView,
    GetNewsView,
    AddNewsView,
    SettingsProfileView,
    UpdateUserProfileView,
    UpdateUserPasswordView,
    GetNewsDetailView,
    DeleteNewsView,
    AddCommentView,
    DeleteCommentView,
)

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', IndexView.as_view(), name='home'),
    path('about/', AboutView.as_view(), name='about'),
    path('news/<int:pk>/', NewsDetailView.as_view(), name='news_detail'),
    path('news/', NewsListView.as_view(), name='news_list'),

    path('news/<int:pk>/add-comment/', AddCommentView.as_view(), name='add-comment'),
    path('delete-comment/<int:comment_id>/', DeleteCommentView.as_view(), name='delete-comment'),
    path('news/<int:pk>/', NewsDetailView.as_view(), name='news-detail'),

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
    path('add-user/', AddUserView.as_view(), name='add_user'),

    # Додані шляхи для новин
    path('get-news/', GetNewsView.as_view(), name='get_news'),
    path('add-news/', AddNewsView.as_view(), name='add_news'),
    path('get-news/<int:news_id>/', GetNewsDetailView.as_view(), name='get_news_detail'),
    path('delete-news/<int:news_id>/', DeleteNewsView.as_view(), name='delete_news'),

    path('settings-profile/', SettingsProfileView.as_view(), name='settings_profile'),  # Доданий URL-шлях для налаштувань профілю
    path('update-login/<int:user_id>/', UpdateUserProfileView.as_view(), name='update_login'),
    path('update-password/<int:user_id>/', UpdateUserPasswordView.as_view(), name='update_password'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
