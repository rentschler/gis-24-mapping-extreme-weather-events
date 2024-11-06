# server.py
from fastapi import FastAPI, Depends, Query
from sqlalchemy import create_engine, text
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker, Session
from settings import settings
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Set up the database
DATABASE_URL = settings.database_url
engine = create_engine(DATABASE_URL)
print(f"Connected to database: {DATABASE_URL}")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Reflect the database tables
Base = automap_base()
Base.prepare(engine, reflect=True)

# Map the car_sharing table
CarSharing = Base.classes.car_sharing

@app.get("/health")
@app.get("/api")
@app.get("/api/health")
async def health():
    return {"status": "ok"}



@app.get("/api/car_sharing")
def read_car_sharing():
    """ responds with all car sharing points"""
    # Define the raw SQL query
    query = text("""
            SELECT
                capacity,
                districtna AS district,
                ST_Y(wkb_geometry) AS latitude,
                ST_X(wkb_geometry) AS longitude,
                name,
                provider,
                json_build_object('street', street, 'number', streetnr) AS address
            FROM car_sharing;
        """)

    # Execute the query
    session = SessionLocal()
    result = session.execute(query)

    # Fetch results and convert each row to a dictionary
    car_sharing_entries = [
        {
            "capacity": row.capacity,
            "district": row.district,
            "latitude": row.latitude,
            "longitude": row.longitude,
            "name": row.name,
            "provider": row.provider,
            "address": row.address,
        }
        for row in result
    ]

    return car_sharing_entries


@app.get("/api/car_sharing/points")
def read_car_sharing(
    latitude: float = Query(None),
    longitude: float = Query(None),
):
    # Check if location parameters are provided
    if latitude is not None and longitude is not None:
        # Define the query with distance calculation and ordering
        query = text(f"""
               SELECT
                   capacity,
                   districtna AS district,
                   ST_Y(wkb_geometry) AS latitude,
                   ST_X(wkb_geometry) AS longitude,
                   name,
                   provider,
                   json_build_object('street', street, 'number', streetnr) AS address,
                   picture,
                   ST_Distance(
                       wkb_geometry,
                       ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326) ::geography
                   ) AS distance
               FROM car_sharing
               ORDER BY distance ASC;
           """)
    else:
        # Define the query sorted by name if no location is specified
        query = text("""
               SELECT
                   capacity,
                   districtna AS district,
                   ST_Y(wkb_geometry) AS latitude,
                   ST_X(wkb_geometry) AS longitude,
                   name,
                   provider,
                   json_build_object('street', street, 'number', streetnr) AS address,
                   picture
               FROM car_sharing
               ORDER BY name ASC;
           """)

    # Execute the query with parameters if location is provided
    session = SessionLocal()
    result = session.execute(query, {"latitude": latitude, "longitude": longitude} if latitude and longitude else {})

    # Fetch results and convert each row to a dictionary
    car_sharing_entries = []
    for row in result:
        entry = {
            "capacity": row.capacity,
            "district": row.district,
            "latitude": row.latitude,
            "longitude": row.longitude,
            "name": row.name,
            "provider": row.provider,
            "address": row.address,
        }

        # Add picture only if it exists
        if row.picture is not None:
            entry["picture"] = row.picture

        # Include distance if calculated
        if latitude is not None and longitude is not None:
            entry["distance"] = row.distance

        car_sharing_entries.append(entry)

    return car_sharing_entries


@app.get("/api/car_sharing/capacity")
def read_car_sharing_capacity(
        districts: Optional[List[str]] = Query(None)
):

    """yields a response with car sharing points sorted by capacity, similar to this
    ```json
    [
     {
     "capacity":4,
     "district":"Paradies",
     "name":"Richentalstr.10/ZufahrtlinksvonGottlieberStr.34",
     "provider":"StadtmobilSüdbaden",
     "address":{
     "street": "Richentalstr.",
     "number": "10"
     }
     },
     {
     "capacity":3,
     "district":"Petershausen-West",
     "name":"Bruder-Klaus-Str.13/Alemannenstr.",
     "provider":"StadtmobilSüdbaden",
     "address":{
     "street": "Bruder-Klaus-Str.",
     "number": "13"
     }
     },
     ...
     ]
    ```
the points are sorted in descending order by their capacity. If the query specifies a set of districts (e.g.,
/api/car-sharing/capacity?districts=A1tstadt&districts=Paradies), the response should only include sharing points from
these districts:"""
    if districts is not None:
        query = text("""
            SELECT
                capacity,
                districtna AS district,
                name,
                provider,
                json_build_object('street', street, 'number', streetnr) AS address
            FROM car_sharing
            WHERE districtna = ANY(:districts)
            ORDER BY capacity DESC;
        """)
    else:
        query = text("""
            SELECT
                capacity,
                districtna AS district,
                name,
                provider,
                json_build_object('street', street, 'number', streetnr) AS address
            FROM car_sharing
            ORDER BY capacity DESC;
        """)

    # Execute the query with parameters if location is provided
    session = SessionLocal()
    result = session.execute(query, {"districts": districts} if districts else {})

    # Fetch results and convert each row to a dictionary
    car_sharing_entries = []
    for row in result:
        entry = {
            "capacity": row.capacity,
            "district": row.district,
            "name": row.name,
            "provider": row.provider,
            "address": row.address,
        }
        car_sharing_entries.append(entry)

    return car_sharing_entries
