# server.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine
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
    session = SessionLocal()
    car_sharing = session.query(CarSharing).all()
    return car_sharing
