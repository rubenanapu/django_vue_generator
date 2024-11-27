"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from app import viewsets as v
from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("books", v.BookViewSet, "books")
router.register("authors", v.AuthorViewSet)
router.register("publishers", v.PublisherViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
] + router.urls

try:
    import ui.urls
    urlpatterns = ui.urls.urlpatterns + urlpatterns
except ImportError:
    pass
