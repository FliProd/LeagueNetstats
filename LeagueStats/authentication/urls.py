from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from .views import ObtainTokenPairWithExtraInfo, Account, LogoutAndBlacklistRefreshTokenForUserView, ValidationTokenView
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('profile/create/', Account.as_view(), name="create_profile"),
    path('profile/update/', Account.as_view(), name='update_profile'),
    path('profile/get/', Account.as_view(), name='get_profile'),
    path('token/obtain/', ObtainTokenPairWithExtraInfo.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('accountVerification/<token>', ValidationTokenView.as_view(), name='account_verification'),
    path('blacklist/', LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='blacklist'),
    path('reset_password/', auth_views.PasswordResetView.as_view(template_name="reset_password.html"),
         name='reset_password'),
    path('reset_password_sent/', auth_views.PasswordResetDoneView.as_view(template_name="password_reset_sent.html"),
         name='password_reset_done'),
    path('reset/<uidb64>/<token>',
         auth_views.PasswordResetConfirmView.as_view(template_name="password_reset_form.html"),
         name='password_reset_confirm'),
    path('reset_password_complete/',
         auth_views.PasswordResetCompleteView.as_view(template_name="password_reset_done.html"),
         name='password_reset_complete')
]
