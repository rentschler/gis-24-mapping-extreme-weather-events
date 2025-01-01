from typing import Annotated

from fastapi import APIRouter, FastAPI, Query, HTTPException, Depends
from fastapi.encoders import jsonable_encoder
from geoalchemy2 import Geography
from geoalchemy2.functions import ST_Within, ST_GeomFromGeoJSON
from shapely.geometry import shape, Polygon, MultiPolygon
from sqlalchemy import create_engine, func, select, or_, and_
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker, Session
from geojson_pydantic import Feature, FeatureCollection, Point

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
        EPS = 0.05
        MINPOINTS = 5
        
        query = cluster_post(db, body, EPS, MINPOINTS)
            
        res = query.all()
                
        clusters_raw = [ClusterDB.from_db(item) for item in res]
        
        clusters_processed = process_cluster(body, clusters_raw)
        
        return cluster_to_geojson(clusters_processed)
        
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

@app.post("/api/data/geometry", response_model=list[HeavyRainResponse])
async def get_data_with_geometry(
    body: GeometryPost,  # Accept GeoJSON as a dictionary
    db: Session = Depends(get_db),
):
    """
    Fetch HeavyRain records that fall within the specified GeoJSON geometry
    with optional date and QC filtering.
    """
    try:
        if not body.geometry:
            raise HTTPException(status_code=400, detail="Geometry payload is required")
        # Validate and parse GeoJSON geometry
        geojson_geometry = jsonable_encoder(body.geometry)
        shapely_geom = shape(body.geometry)  # Convert GeoJSON to Shapely geometry
        if not shapely_geom.is_valid:
            raise HTTPException(status_code=400, detail="Invalid GeoJSON geometry")
        if not isinstance(shapely_geom, (Polygon, MultiPolygon)):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid geometry type: {shapely_geom.geom_type}. Expected Polygon or MultiPolygon."
            )
        
        # Construct the base query
        query = db.query(HeavyRain).filter(
            ST_Within(
                HeavyRain.geom,  # Assuming `geom` is the geometry column in HeavyRain
                ST_GeomFromGeoJSON(json.dumps(body.geometry))  # Convert GeoJSON to PostGIS geometry
            )
        )

        # Add date filtering conditions if provided
        # if date_from:
        #     query = query.filter(HeavyRain.time_event >= date_from)
        # if date_to:
        #     query = query.filter(HeavyRain.time_event <= date_to)

        # # Add QC level filtering if provided
        # if qc:
        #     query = query.filter(HeavyRain.qc_level == qc)

        # Execute the query and fetch results
        results = query.all()

        return [HeavyRainResponse.from_db(item) for item in results]

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing request: {str(e)}")

app.include_router(router)
