from pydantic import BaseModel
from enum import Enum
from datetime import date, datetime, time, timedelta
from sqlalchemy import Double, Integer, PrimaryKeyConstraint, Text
from sqlalchemy.orm import mapped_column, declarative_base

from typing import Optional, Dict, Union

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

class QcEnum(Enum):
    QC1 = "QC1"
    QC2 = "QC2"
    QC3 = "QC3"

class Coordinates(BaseModel):
    latitude: Optional[float]
    longitude: Optional[float]

class LocationDetails(BaseModel):
    country: Optional[str] = None
    state: Optional[str] = None
    place: Optional[str] = None
    place_local_language: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    place_accuracy: Optional[str] = None
    surface_initial_location: Optional[str] = None
    surface_crossed: Optional[str] = None


class EventDetails(BaseModel):
    qc_level: Optional[str] = None
    info_source: Optional[str] = None
    contact: Optional[str] = None
    organisation: Optional[str] = None
    organisation_id: Optional[str] = None
    no_revision: Optional[int] = None
    person_revision: Optional[str] = None
    time_event: Optional[str] = None
    time_creation: Optional[str] = None
    time_last_revision: Optional[str] = None
    time_accuracy: Optional[str] = None
    type_event: Optional[str] = None
    precipitation_amount: Optional[str] = None
    max_6_hour_precip: Optional[str] = None
    max_12_hour_precip: Optional[str] = None
    max_24_hour_precip: Optional[str] = None
    convective: Optional[str] = None
    total_duration: Optional[str] = None
    except_elec_phenom: Optional[str] = None
    no_injured: Optional[str] = None
    no_killed: Optional[str] = None
    event_description: Optional[str] = None
    ext_url: Optional[str] = None
    reference: Optional[str] = None
    impacts: Optional[str] = None


class CreatorRevisorDetails(BaseModel):
    creator_id: Optional[str] = None
    revisor_id: Optional[str] = None
    link_org: Optional[str] = None
    link_id: Optional[str] = None
    deleted: Optional[str] = None


class HeavyRainResponse(BaseModel):
    id: int
    location: LocationDetails
    event: EventDetails
    creator_revisor: CreatorRevisorDetails

    class Config:
        orm_mode = True
        
    @classmethod
    def from_flat_dict(cls, heavy_rain: "HeavyRain") -> "HeavyRainResponse":
        """Converts a HeavyRain SQLAlchemy model instance into a nested HeavyRainModel."""
        if not isinstance(heavy_rain, HeavyRain):
            raise TypeError(f"Expected a HeavyRain instance, got {type(heavy_rain).__name__}")

        return cls(
            id=heavy_rain.id,
            location=LocationDetails(
                country=getattr(heavy_rain, "country", None),
                state=getattr(heavy_rain, "state", None),
                place=getattr(heavy_rain, "place", None),
                place_local_language=getattr(heavy_rain, "place_local_language", None),
                detailed_location=getattr(heavy_rain, "detailed_location", None),
                latitude=getattr(heavy_rain, "latitude", None),
                longitude=getattr(heavy_rain, "longitude", None),
                place_accuracy=getattr(heavy_rain, "place_accuracy", None),
                surface_initial_location=getattr(heavy_rain, "surface_initial_location", None),
                surface_crossed=getattr(heavy_rain, "surface_crossed", None),
            ),
            event=EventDetails(
                qc_level=getattr(heavy_rain, "qc_level", None),
                info_source=getattr(heavy_rain, "info_source", None),
                contact=getattr(heavy_rain, "contact", None),
                organisation=getattr(heavy_rain, "organisation", None),
                organisation_id=getattr(heavy_rain, "organisation_id", None),
                no_revision=getattr(heavy_rain, "no_revision", None),
                person_revision=getattr(heavy_rain, "person_revision", None),
                time_event=getattr(heavy_rain, "time_event", None),
                time_creation=getattr(heavy_rain, "time_creation", None),
                time_last_revision=getattr(heavy_rain, "time_last_revision", None),
                time_accuracy=getattr(heavy_rain, "time_accuracy", None),
                type_event=getattr(heavy_rain, "type_event", None),
                precipitation_amount=getattr(heavy_rain, "precipitation_amount", None),
                max_6_hour_precip=getattr(heavy_rain, "max_6_hour_precip", None),
                max_12_hour_precip=getattr(heavy_rain, "max_12_hour_precip", None),
                max_24_hour_precip=getattr(heavy_rain, "max_24_hour_precip", None),
                convective=getattr(heavy_rain, "convective", None),
                total_duration=getattr(heavy_rain, "total_duration", None),
                except_elec_phenom=getattr(heavy_rain, "except_elec_phenom", None),
                no_injured=getattr(heavy_rain, "no_injured", None),
                no_killed=getattr(heavy_rain, "no_killed", None),
                event_description=getattr(heavy_rain, "event_description", None),
                ext_url=getattr(heavy_rain, "ext_url", None),
                reference=getattr(heavy_rain, "reference", None),
                impacts=getattr(heavy_rain, "impacts", None),
            ),
            creator_revisor=CreatorRevisorDetails(
                creator_id=getattr(heavy_rain, "creator_id", None),
                revisor_id=getattr(heavy_rain, "revisor_id", None),
                link_org=getattr(heavy_rain, "link_org", None),
                link_id=getattr(heavy_rain, "link_id", None),
                deleted=getattr(heavy_rain, "deleted", None),
            ),
        )