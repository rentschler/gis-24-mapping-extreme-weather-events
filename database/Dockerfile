FROM postgis/postgis:16-3.4

ENV POSTGRES_DB=rain
ENV POSTGRES_USER=admin

WORKDIR /app

# Install necessary packages
RUN apt-get update && apt-get install -y  binutils libproj-dev dos2unix

# Copy data to docker-entrypoint
# All Files here will be automatically called AFTER the database has been created
COPY data.csv /docker-entrypoint-initdb.d/data.csv
COPY seed.sh /docker-entrypoint-initdb.d/seed.sh

# Provide access rights to seed.sh
RUN chmod +x /docker-entrypoint-initdb.d/seed.sh

# Unix has some weird encoding so this fixes it
RUN dos2unix /docker-entrypoint-initdb.d/seed.sh


EXPOSE 5432 5433
