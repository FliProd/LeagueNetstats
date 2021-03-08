from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import ObtainTokenPairWithExtraInfo, Account, LogoutAndBlacklistRefreshTokenForUserView

urlpatterns = [
    path('profile/create/', Account.as_view(), name="create_profile"),
    path('profile/update/', Account.as_view(), name='update_profile'),
    path('profile/get/', Account.as_view(), name='get_profile'),
    path('token/obtain/', ObtainTokenPairWithExtraInfo.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('blacklist/', LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='blacklist')
]
