from fastapi import FastAPI, Query
from typing import List, Optional
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import select
from settings import settings
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func

from fastapi.responses import JSONResponse
DATABASE_URL = settings.database_url


app = FastAPI()


engine = create_engine("postgresql://admin:password@database:5432/rain")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

 
Base = automap_base()
Base.prepare(engine, reflect=True)
HeavyRain = Base.classes.heavy_rain
 

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/api/data")
async def get_data():
    db  = Session(engine)
    res = db.query(HeavyRain).all()
    return res

@app.get("/api/health")
async def car_sharing_capacity():
    return {"status": "api proxy ok"}