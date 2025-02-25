#!/bin/sh
set -e  # Exit script if any command fails

echo "Starting entrypoint script..."

if [ "$DATABASE" = "postgres" ] || [ -n "$DATABASE_HOST" ]; then
    echo "Waiting for PostgreSQL to start..."

    timeout=30
    while ! nc -z $DATABASE_HOST $DATABASE_PORT; do
        sleep 1
        timeout=$((timeout - 1))
        if [ $timeout -eq 0 ]; then
            echo "Error: PostgreSQL did not start in time!"
            exit 1
        fi
    done

    echo "PostgreSQL is up!"
fi

# Apply migrations
echo "Applying migrations..."
python manage.py makemigrations
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start Django server
echo "Starting Django server..."
exec python manage.py runserver 0.0.0.0:8000


#exec "$@"