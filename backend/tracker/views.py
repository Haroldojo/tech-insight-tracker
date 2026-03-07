from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound

from .models import Insight, Project
from .serializers import InsightSerializer, ProjectSerializer


# ── Projects ────────────────────────────────────────────────


class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user)


# ── Insights (nested under project) ────────────────────────


class InsightListCreateView(generics.ListCreateAPIView):
    serializer_class = InsightSerializer

    def _get_project(self):
        try:
            return Project.objects.get(
                pk=self.kwargs["project_id"],
                owner=self.request.user,
            )
        except Project.DoesNotExist:
            raise NotFound("Project not found.")

    def get_queryset(self):
        project = self._get_project()
        return Insight.objects.filter(project=project)

    def perform_create(self, serializer):
        project = self._get_project()
        serializer.save(project=project)


# ── Insight detail (flat) ──────────────────────────────────


class InsightDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InsightSerializer

    def get_queryset(self):
        return Insight.objects.filter(project__owner=self.request.user)
