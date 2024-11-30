#!/bin/bash
echo "Entered custom shell script for loading data" 
# Wait for PostgreSQL to be ready
until pg_isready -d "rain" -p "5432" -U "admin"; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

# Create the table (you can modify the schema as needed)
psql  -p "5432" -U "admin" -d "rain" <<EOF
CREATE TABLE IF NOT EXISTS heavy_rain (
    ID INTEGER  PRIMARY KEY,
    QC_LEVEL TEXT,
    INFO_SOURCE TEXT,
    CONTACT TEXT,
    ORGANISATION TEXT,
    ORGANISATION_ID TEXT,
    NO_REVISION INTEGER,
    PERSON_REVISION TEXT,
    TIME_EVENT TIMESTAMP,
    TIME_CREATION TIMESTAMP,
    TIME_LAST_REVISION TIMESTAMP,
    TIME_ACCURACY TEXT,
    COUNTRY TEXT,
    STATE TEXT,
    PLACE TEXT,
    PLACE_LOCAL_LANGUAGE TEXT,
    DETAILED_LOCATION TEXT,
    LATITUDE FLOAT,
    LONGITUDE FLOAT,
    PLACE_ACCURACY TEXT,
    SURFACE_INITIAL_LOCATION TEXT,
    SURFACE_CROSSED TEXT,
    TYPE_EVENT TEXT,
    PRECIPITATION_AMOUNT TEXT,
    MAX_6_HOUR_PRECIP TEXT,
    MAX_12_HOUR_PRECIP TEXT,
    MAX_24_HOUR_PRECIP TEXT,
    CONVECTIVE TEXT,
    TOTAL_DURATION TEXT,
    EXCEPT_ELEC_PHENOM TEXT,
    NO_INJURED TEXT,
    NO_KILLED TEXT,
    EVENT_DESCRIPTION TEXT,
    EXT_URL TEXT,
    REFERENCE TEXT,
    IMPACTS TEXT,
    CREATOR_ID TEXT,
    REVISOR_ID TEXT,
    LINK_ORG TEXT,
    LINK_ID TEXT,
    DELETED TEXT
);
EOF

# Load the data from the CSV file into the table
echo "Loading data from /docker-entrypoint-initdb.d/data.csv into heavy_rain table..."
psql -p "5432" -U "admin" -d "rain" <<EOF
\COPY heavy_rain(ID,QC_LEVEL,INFO_SOURCE,CONTACT,ORGANISATION,ORGANISATION_ID,NO_REVISION,PERSON_REVISION,TIME_EVENT,TIME_CREATION,TIME_LAST_REVISION,TIME_ACCURACY,COUNTRY,STATE,PLACE,PLACE_LOCAL_LANGUAGE,DETAILED_LOCATION,LATITUDE,LONGITUDE,PLACE_ACCURACY,SURFACE_INITIAL_LOCATION,SURFACE_CROSSED,TYPE_EVENT,PRECIPITATION_AMOUNT,MAX_6_HOUR_PRECIP,MAX_12_HOUR_PRECIP,MAX_24_HOUR_PRECIP,CONVECTIVE,TOTAL_DURATION,EXCEPT_ELEC_PHENOM,NO_INJURED,NO_KILLED,EVENT_DESCRIPTION,EXT_URL,REFERENCE,IMPACTS,CREATOR_ID,REVISOR_ID,LINK_ORG,LINK_ID,DELETED) FROM '/docker-entrypoint-initdb.d/data.csv' WITH CSV HEADER QUOTE '"' NULL AS 'NA';
EOF

# Add geometry column and populate it
echo "Adding geometry column and populating it with lat/lon data..."
psql -p "5432" -U "admin" -d "rain" <<EOF
-- Add the geometry column
ALTER TABLE heavy_rain ADD COLUMN geom geometry(Point, 4326);

-- Populate the geometry column
UPDATE heavy_rain
SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326);

-- Create a spatial index for the geometry column
CREATE INDEX idx_heavy_rain_geom ON heavy_rain USING GIST (geom);
EOF

echo "Data loaded successfully into the heavy_rain table."
