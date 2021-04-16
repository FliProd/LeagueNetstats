from django.contrib import admin
from .models import Match, Event, Frame, NetworkLog
# Register your models here.

admin.site.register(Match)
admin.site.register(Event)
admin.site.register(Frame)
admin.site.register(NetworkLog)
