from geoalchemy2 import Geography
from geoalchemy2.functions import ST_Within, ST_GeomFromGeoJSON
from shapely.geometry import shape, Polygon, MultiPolygon
from sqlalchemy import create_engine, func, select, or_, and_
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker, Session

from DataModel import *


def heavy_rain_post(body: HeavyRainPost, query):
        
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

    