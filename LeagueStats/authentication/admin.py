from django.contrib import admin
from .models import Profile, CustomUser, ValidationToken

admin.site.register(Profile)
admin.site.register(CustomUser)
admin.site.register(ValidationToken)
