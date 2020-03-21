import datetime

from django.contrib.auth.decorators import login_required
# Create your views here.
from django.http import HttpResponse


def current_datetime(request):
    now = datetime.datetime.now()
    html = "<html><body>It is now %s.</body></html>" % now
    return HttpResponse(html)


@login_required
def my_account(request):
    print(request)
    return HttpResponse("<html><body>%s</body></html>" % request.user.get_full_name())
