from sqlalchemy import Double, Integer, PrimaryKeyConstraint, Text
from sqlalchemy.orm import mapped_column, declarative_base
from sqlalchemy.ext.declarative import declared_attr
from geoalchemy2 import Geometry

Base = declarative_base()

class HeavyRain(Base):
    __tablename__ = 'heavy_rain'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='heavy_rain_pkey'),
    )

    id = mapped_column(Integer)
    qc_level = mapped_column(Text)
    info_source = mapped_column(Text)
    contact = mapped_column(Text)
    organisation = mapped_column(Text)
    organisation_id = mapped_column(Text)
    no_revision = mapped_column(Integer)
    person_revision = mapped_column(Text)
    time_event = mapped_column(Text)
    time_creation = mapped_column(Text)
    time_last_revision = mapped_column(Text)
    time_accuracy = mapped_column(Text)
    country = mapped_column(Text)
    state = mapped_column(Text)
    place = mapped_column(Text)
    place_local_language = mapped_column(Text)
    detailed_location = mapped_column(Text)
    latitude = mapped_column(Double(53))
    longitude = mapped_column(Double(53))
    place_accuracy = mapped_column(Text)
    surface_initial_location = mapped_column(Text)
    surface_crossed = mapped_column(Text)
    type_event = mapped_column(Text)
    precipitation_amount = mapped_column(Text)
    max_6_hour_precip = mapped_column(Text)
    max_12_hour_precip = mapped_column(Text)
    max_24_hour_precip = mapped_column(Text)
    convective = mapped_column(Text)
    total_duration = mapped_column(Text)
    except_elec_phenom = mapped_column(Text)
    no_injured = mapped_column(Text)
    no_killed = mapped_column(Text)
    event_description = mapped_column(Text)
    ext_url = mapped_column(Text)
    reference = mapped_column(Text)
    impacts = mapped_column(Text)
    creator_id = mapped_column(Text)
    revisor_id = mapped_column(Text)
    link_org = mapped_column(Text)
    link_id = mapped_column(Text)
    deleted = mapped_column(Text)
    geom = mapped_column(Geometry(geometry_type='POINT', srid=4326))


class HeavyRainCluster(HeavyRain):
    __tablename__ = HeavyRain.__tablename__  # Use the same table as HeavyRain
    __table_args__ = {'extend_existing': True}

    cluster_id = mapped_column(Integer, nullable=True)
    
    # @declared_attr
    # def cluster_id(cls):
    #     return mapped_column(Integer, nullable=True)