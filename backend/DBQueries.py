from geoalchemy2 import Geography
from geoalchemy2.functions import ST_Within, ST_GeomFromGeoJSON
from shapely.geometry import shape, Polygon, MultiPolygon
from sqlalchemy import create_engine, func, select, or_, and_
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker, Session, aliased
from sqlalchemy.sql import text 


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
