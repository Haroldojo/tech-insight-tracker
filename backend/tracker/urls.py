from django.urls import path

from . import views

urlpatterns = [
    path("projects/", views.ProjectListCreateView.as_view(), name="project-list"),
    path("projects/<int:pk>/", views.ProjectDetailView.as_view(), name="project-detail"),
    path(
        "projects/<int:project_id>/insights/",
        views.InsightListCreateView.as_view(),
        name="insight-list",
    ),
    path("insights/<int:pk>/", views.InsightDetailView.as_view(), name="insight-detail"),
]
