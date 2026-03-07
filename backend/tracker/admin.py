from django.contrib import admin

from .models import Insight, Project

admin.site.register(Project)
admin.site.register(Insight)
