#!/bin/sh

if [ "$DATABASE" = "postgres" ]; then
    echo "Waiting for postgres..."

    while ! nc -z $DATABASE_HOST $DATABASE_PORT; do
        echo "Waiting for postgres..."
    sleep 1
    done

    echo "PostgreSQL started"
fi

# Make migrations 
python manage.py makemigrations

python manage.py migrate

python manage.py collectstatic --noinput

python manage.py runserver 0.0.0:8000

exec "$@"