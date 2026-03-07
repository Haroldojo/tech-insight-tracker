from rest_framework import serializers

from .models import Insight, Project


class InsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insight
        fields = (
            "id",
            "title",
            "content",
            "source_url",
            "tags",
            "project",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "project", "created_at", "updated_at")


class ProjectSerializer(serializers.ModelSerializer):
    insights_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            "id",
            "name",
            "description",
            "owner",
            "insights_count",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "owner", "created_at", "updated_at")

    def get_insights_count(self, obj):
        return obj.insights.count()
