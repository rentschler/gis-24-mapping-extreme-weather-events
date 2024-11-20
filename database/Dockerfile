FROM postgis/postgis:16-3.4

ENV POSTGRES_DB=geographic-information-systems
ENV POSTGRES_USER=student

RUN apt-get update && apt-get install -y binutils libproj-dev gdal-bin

COPY Carsharing.geojson /docker-entrypoint-initdb.d/Carsharing.geojson
COPY seed.sh /docker-entrypoint-initdb.d/seed.sh
RUN chmod +x /docker-entrypoint-initdb.d/seed.sh

EXPOSE 5432
