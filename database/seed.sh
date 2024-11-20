#!/bin/sh

pg_isready --dbname=geographic-information-systems --username=student && psql --dbname=geographic-information-systems --username=student --list
# We cannot connect to `localhost`, while exposing a port through Docker Compose (see https://www.reddit.com/r/docker/comments/14kwsy7/comment/jptyb8w) but instead refer to the socket (see https://stackoverflow.com/a/29356068)
/usr/bin/ogr2ogr -f "PostgreSQL" PG:"port=5432 dbname=geographic-information-systems user=student password=${POSTGRES_PASSWORD}" '/docker-entrypoint-initdb.d/Carsharing.geojson' -nln car_sharing -overwrite
