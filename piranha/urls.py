"""piranha URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
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
from django.contrib import admin
from django.urls import path, re_path, include

from piranha.views import index
from seaport.views import PrivateGraphQLView

# This will redirect the rest of the urls to this handler, will only display when DEBUG is false
handler404 = 'piranha.views.handler404'

urlpatterns = [
    path('', include('social_django.urls', namespace='social')),
    path('api/graphql', PrivateGraphQLView.as_view(graphiql=True)),
    re_path('api/admin/?', admin.site.urls),
    path('api', include('expenses.urls')),
    path('', index, name="index")
]
