from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import ObtainTokenPairWithExtraInfo, ProfileCreate, LogoutAndBlacklistRefreshTokenForUserView

urlpatterns = [
    path('profile/create/', ProfileCreate.as_view(), name="create_profile"),
    path('token/obtain/', ObtainTokenPairWithExtraInfo.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('blacklist/', LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='blacklist')
]
