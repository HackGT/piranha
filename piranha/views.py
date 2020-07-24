from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def handler404(request, exception):
    return render(request, "build/index.html")


@login_required
def index(request):
    return render(request, "build/index.html")