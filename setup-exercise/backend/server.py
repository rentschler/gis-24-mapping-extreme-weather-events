# server.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, text
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker, Session
from settings import settings

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
