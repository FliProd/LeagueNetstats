from django.urls import path
from django.conf.urls import url

from django.views.generic.base import TemplateView
from .views import index

urlpatterns = [
    path("riot.txt", TemplateView.as_view(template_name="frontend/riot.txt", content_type="text/plain")),
    path('', index),  # for the empty url
    url(r'^.*/$', index)  # for all other urls
]
