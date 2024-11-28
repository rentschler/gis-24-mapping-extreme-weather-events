from typing import Annotated

from fastapi import APIRouter, FastAPI, Query, HTTPException, Depends
from geoalchemy2 import Geography
from sqlalchemy import create_engine, func, select
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker, Session

from settings import settings

from datetime import datetime, date

from DataModel import *
DATABASE_URL = settings.database_url

app = FastAPI()
router = APIRouter(prefix="/api")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base = automap_base()
Base.prepare(engine, reflect=True)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/api/data", response_model=list[HeavyRainResponse])
async def get_data(db: Session = Depends(get_db), 
                   date_from: date = None,
                   date_to: date = None,
                   limit: int = None,
                   qc : QcEnum = None):
    
    if date_from and date_to and date_from > date_to:
        raise HTTPException(status_code=400, detail="Invalid date range, date_from must be before date_to")
    
    # Start the query
    query = db.query(HeavyRain)
    
    # Add date filtering conditions to the query
    if date_from:
        query = query.filter(HeavyRain.time_event >= date_from)
    if date_to:
        query = query.filter(HeavyRain.time_event <= date_to)
    if qc:
        query = query.filter(HeavyRain.qc_level == qc)
    
    if limit:
        query = query.limit(limit)
    
    # Execute query with a limit of 2
    res = query.all()
    
    return [HeavyRainResponse.from_flat_dict(item) for item in res]

app.include_router(router)
