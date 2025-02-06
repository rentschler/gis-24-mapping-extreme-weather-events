from typing import Annotated

import geojson.geometry

from fastapi import APIRouter, FastAPI, Query, HTTPException, Depends
from fastapi.encoders import jsonable_encoder
from geoalchemy2 import Geography
from geoalchemy2.functions import ST_Within, ST_GeomFromGeoJSON
from shapely.geometry import shape, Polygon, MultiPolygon
from sqlalchemy import create_engine, func, select, or_, and_
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker, Session
from geojson_pydantic import Feature, FeatureCollection, Point
import geojson_pydantic
import geojson


from settings import settings
from datetime import datetime, date
import json
import traceback

from DataModel import *
from DBQueries import *
from DataProcessing import *

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

@app.post("/api/data", response_model=list[HeavyRainResponse])
async def get_data_with_geometry(
    body: HeavyRainPost,  # Accept GeoJSON as a dictionary
    db: Session = Depends(get_db),
):
    try:        
        query = heavy_rain_post(body, db)
            
        res = query.all()
        res_list = [HeavyRainResponse.from_db(item) for item in res] 
        
        # post filtering
        
        res_list = post_filter_rain(body, res_list)
        
        return res_list
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing request: {str(e)}")


@app.post("/api/cluster", response_model=FeatureCollection)
async def get_clusters(
    body: ClusterPost,
    db: Session = Depends(get_db),
):
    try:
        EPS = 0.06
        MINPOINTS = 10
        
        query = cluster_post(db, body, EPS, MINPOINTS)
            
        res = query.all()
                
        clusters_raw = [ClusterDB.from_db(item) for item in res]
        
        clusters_processed = process_cluster(body, clusters_raw)
        
        
        group_list = [ClusterGrouped(**item) for item in clusters_processed]
        
        return cluster_to_geojson(group_list)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing request: {str(e)}         {traceback.format_exc()}")



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
    
    return [HeavyRainResponse.from_db(item) for item in res]

@app.get("/api/data/{id}", response_model=HeavyRainResponse)
async def get_data_by_id(id: int, db: Session = Depends(get_db)):
    item = db.query(HeavyRain).filter(HeavyRain.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return HeavyRainResponse.from_db(item)

@app.post("/api/data/geometry", response_model=list[GeometryGrouped])
async def get_data_with_geometry(
    body: GeometryPost,  # Accept GeoJSON as a dictionary
    db: Session = Depends(get_db),
):
    """
    Fetch HeavyRain records that fall within the specified GeoJSON geometry
    with optional date and QC filtering.
    """
    try:
        # for feature in body:
        #     if not geojson.geometry.is_valid(feature):
        #         raise HTTPException(status_code=400, detail="Invalid GeoJSON feature")
        # Validate and parse GeoJSON geometry
        
        query = geometry_post(body, db)
        
        results = query.all()
        
        geometry_raw = [GeometryDB.from_db(item) for item in results]
        
        geometry_processed = process_geometry(body, geometry_raw)
        
        print(geometry_processed)
        
        group_list = [GeometryGrouped(**item) for item in geometry_processed]

        return group_list

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing request: {str(e)}, {traceback.format_exc()}")

app.include_router(router)
