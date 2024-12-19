from geoalchemy2 import Geography
from geoalchemy2.functions import ST_Within, ST_GeomFromGeoJSON
from shapely.geometry import shape, Polygon, MultiPolygon
from sqlalchemy import create_engine, func, select, or_, and_
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker, Session, aliased
from sqlalchemy.sql import text 


from DataModel import *


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


# def cluster_post(db, eps: int, minpoints: int):
    
#     raw_sql = text("""
#         SELECT 
#             st_clusterdbscan AS cluster_id,
#             ST_ConvexHull(ST_Collect(geom)) AS cluster_polygon
#         FROM (
#             SELECT 
#                 id, 
#                 geom, 
#                 ST_ClusterDBSCAN(geom, eps => :eps, minpoints => :minpoints) OVER () AS st_clusterdbscan
#             FROM "public"."heavy_rain"
#             WHERE time_event >= :start_time
#               AND time_event < :end_time
#         ) clustered_points
#         GROUP BY st_clusterdbscan;
#     """)
    
#     params= {
#         "eps": 0.05,
#         "minpoints": 5,
#         "start_time": '2021-07-13',
#         "end_time": '2021-07-15'
#         }
    
#     # result = db.query(HeavyRain).from_statement(raw_sql).params(params).all()
    
#     result = db.execute(raw_sql, params)
    
#     return result

def cluster_post(db, eps: float, minpoints: int):
    # Alias for clustered points
    clustered_points = aliased(HeavyRain)

    start_time = '2021-07-13'
    end_time = '2021-07-15'
    
    st_clusterdbscan = func.ST_ClusterDBSCAN
    
    # Subquery: Generate clusters using ST_ClusterDBSCAN
    subquery = (
        select(
            clustered_points.id,
            clustered_points.geom,
            st_clusterdbscan(
                clustered_points.geom,
                text(f"eps => {eps}"),
                text(f"minpoints => {minpoints}")
            ).over()  # Window function
            .label("cluster_id")
        )
        .where(
            and_(
                clustered_points.time_event >= start_time,
                clustered_points.time_event < end_time
            )
        )
        .subquery("clustered_points")
    )

    # Main query: Generate convex hulls for each cluster
    query = (
        db.query(
            subquery.c.cluster_id,
            func.ST_AsText(func.ST_ConvexHull(func.ST_Collect(subquery.c.geom))).label("cluster_polygon")
        )
        .group_by(subquery.c.cluster_id)
    )


    return query