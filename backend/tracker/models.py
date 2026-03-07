from django.conf import settings
from django.db import models


class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="projects",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return self.name


class Insight(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    source_url = models.URLField(blank=True, default="")
    tags = models.CharField(max_length=500, blank=True, default="")
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="insights",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
