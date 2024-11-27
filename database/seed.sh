#!/bin/sh

pg_isready --dbname=rain --username=admin && psql --dbname=rain --username=admin --list

# Database configuration
DB_NAME="rain"
DB_USER="admin"
DB_HOST=""
DB_PORT="5432"

# Table name to check
TABLE_NAME="heavy_rain"

# Check if the table exists in the database
TABLE_EXISTS=$(psql -d "$DB_NAME" -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -tAc \
"SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '$TABLE_NAME');")

# Remove leading/trailing whitespace from the result
TABLE_EXISTS=$(echo "$TABLE_EXISTS" | xargs)

if [ "$TABLE_EXISTS" == "t" ]; then
    echo "The table '$TABLE_NAME' exists in the database. No action required."
else
    echo "The table '$TABLE_NAME' does not exist in the database. Executing Python script."
    # python3 run_script.py
fi


# We cannot connect to `localhost`, while exposing a port through Docker Compose (see https://www.reddit.com/r/docker/comments/14kwsy7/comment/jptyb8w) but instead refer to the socket (see https://stackoverflow.com/a/29356068)
# /usr/bin/ogr2ogr -f "PostgreSQL" PG:"port=5432 dbname=geographic-information-systems user=student password=${POSTGRES_PASSWORD}" '/docker-entrypoint-initdb.d/Carsharing.geojson' -nln car_sharing -overwrite
