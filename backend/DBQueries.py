from geoalchemy2 import Geography
from geoalchemy2.functions import ST_Within, ST_GeomFromGeoJSON
from shapely.geometry import shape, Polygon, MultiPolygon
from sqlalchemy import create_engine, func, select, or_, and_, case
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker, Session, aliased
from sqlalchemy.sql import text 

from sqlalchemy.orm import sessionmaker, Session
from geojson_pydantic import Feature, FeatureCollection, Point

import json
import geojson

from DataModel import *
from DBModel import *

def heavy_rain_post(body: HeavyRainPost, db):
    
    query = db.query(HeavyRain)
        
    if body.filters.timeRange:
        query = query.filter(HeavyRain.time_event.between(body.filters.timeRange[0], body.filters.timeRange[1]))

    if body.filters.impactCodes:
        string_lookup = [HeavyRain.impacts.contains(code) for code in body.filters.impactCodes]
        query = query.filter(or_(*string_lookup))
        
    if body.filters.qcLevels:
        string_lookup = [HeavyRain.qc_level == code for code in body.filters.qcLevels]
        query = query.filter(or_(*string_lookup))
        
    if body.filters.infoSources:
        string_lookup = [HeavyRain.info_source.contains(code) for code in body.filters.infoSources]
        query = query.filter(or_(*string_lookup))
        
    return query



def cluster_post(db, body, eps: float, minpoints: int):
    # Alias for clustered points
    clustered_points = aliased(HeavyRain)
    
    st_clusterdbscan = func.ST_ClusterDBSCAN
    
    # Subquery: Generate clusters using ST_ClusterDBSCAN
    query = db.query(
        clustered_points,
        st_clusterdbscan(
            clustered_points.geom,
            text(f"eps => {eps}"),
            text(f"minpoints => {minpoints}")
        ).over().label("cluster_id")  # Window function
    )
    
    # Apply filter to exclude rows where cluster_id is None
    # query = query.filter(text("cluster_id IS NOT NULL"))
    
    if body.filters.timeRange:
        query = query.filter(clustered_points.time_event.between(body.filters.timeRange[0], body.filters.timeRange[1]))
    
    if body.filters.impactCodes:
        string_lookup = [clustered_points.impacts.contains(code) for code in body.filters.impactCodes]
        query = query.filter(or_(*string_lookup))
        
    if body.filters.qcLevels:
        string_lookup = [clustered_points.qc_level == code for code in body.filters.qcLevels]
        query = query.filter(or_(*string_lookup))
        
    if body.filters.infoSources:
        string_lookup = [clustered_points.info_source.contains(code) for code in body.filters.infoSources]
        query = query.filter(or_(*string_lookup))

    return query



def geometry_post(body: GeometryPost, db):
    polygon_conditions = []
    polygon_labels = []
    
    
    for i, geometry in enumerate(body.geometry):
        polygon_geom = ST_GeomFromGeoJSON(geometry.model_dump_json())
        condition = ST_Within(HeavyRain.geom, polygon_geom)
        label = f'{i + 1}'
        polygon_conditions.append(condition)
        polygon_labels.append((condition, label))
    
    # Create a CASE statement to label each point with the polygon
    polygon_case = case(
        *[(cond, label) for cond, label in zip(polygon_conditions, [f'{i + 1}' for i in range(len(body.geometry))])]
    )
    
    # Final query
    query = db.query(
        HeavyRain,
        polygon_case.label('polygon_id')  # Add the label column
    ).filter(
        or_(*polygon_conditions)  # Combine all polygon conditions with OR
    )
    
    return query


# Testing this
def geometry_post_geojson(body: GeometryPostGeoJSON, db):
    polygon_conditions = []
    polygon_labels = []
    
    for i, feature in enumerate(body.geojsons):
        polygon_geom = ST_GeomFromGeoJSON(feature.geometry.json())
        condition = ST_Within(HeavyRain.geom, polygon_geom)
        label = f'{i + 1}'
        polygon_conditions.append(condition)
        polygon_labels.append((condition, label))
    
    polygon_case = case(
        *[(cond, label) for cond, label in zip(polygon_conditions, [f'{i + 1}' for i in range(len(body.geojsons))])]
    )
    
    query = db.query(
        HeavyRain,
        polygon_case.label('polygon_id')
    ).filter(
        or_(*polygon_conditions)
    )
    
    # Apply filters
    if body.filters:
        if body.filters.timeRange:
            query = query.filter(HeavyRain.time_event.between(body.filters.timeRange[0], body.filters.timeRange[1]))

        if body.filters.impactCodes:
            string_lookup = [HeavyRain.impacts.contains(code) for code in body.filters.impactCodes]
            query = query.filter(or_(*string_lookup))

        if body.filters.qcLevels:
            string_lookup = [HeavyRain.qc_level == code for code in body.filters.qcLevels]
            query = query.filter(or_(*string_lookup))

        if body.filters.infoSources:
            string_lookup = [HeavyRain.info_source.contains(code) for code in body.filters.infoSources]
            query = query.filter(or_(*string_lookup))
    
    return query
