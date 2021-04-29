#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."
    echo $SQL_HOST
    echo $SQL_PORT
    echo $(nc -z $SQL_HOST $SQL_PORT)
    echo $( ! nc -z $SQL_HOST $SQL_PORT)

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# python manage.py migrate authentication
# python manage.py migrate

echo "migrated"


exec "$@"