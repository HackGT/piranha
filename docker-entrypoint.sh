#!/bin/bash

python manage.py migrate --noinput        # Apply database migrations
python manage.py collectstatic --noinput  # Collect static files

exec gunicorn piranha.wsgi:application --bind :8000 --workers 2