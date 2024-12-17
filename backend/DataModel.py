from pydantic import BaseModel, field_validator, conlist
from enum import Enum
from datetime import date, datetime, time, timedelta
import re

from typing import Optional, Dict, Union
from datetime import date, datetime, timedelta

from DBModel import *


class QcEnum(str, Enum):
    QC2 = "QC2"
    QC1 = "QC1"
    QC0plus = 'QC0+'

class Coordinates(BaseModel):
    latitude: Optional[float]
    longitude: Optional[float]

class LocationDetails(BaseModel):
    coordinates: Optional[Coordinates] = None
    country: Optional[str] = None
    state: Optional[str] = None
    place: Optional[str] = None
    place_local_language: Optional[str] = None
    place_accuracy: Optional[str] = None
    surface_initial_location: Optional[str] = None
    surface_crossed: Optional[str] = None

impact_code_data = {
        "T1": "Road(s) impassable or closed",
        "T2": "Road(s) damaged or destroyed",
        "T3": "Bridge(s) damaged or destroyed",
        "T4": "Rail-/tram-/subway(s) unusable or closed",
        "T5": "Rail-/tram-/subway infrastructure damaged",
        "T6": "Rail-/tram-/subway vehicle(s) damaged or destroyed",
        "T7": "Airport(s) closed (for more than an hour)",
        "T8": "Aircraft damaged or destroyed",
        "T9": "Ship(s) damaged or destroyed",
        "T10": "Inhabited place(s) cut off from transport infrastructure",
        "I1": "Power transmission damaged or destroyed",
        "I2": "Telecommunication infrastructure damaged or destroyed",
        "H1": "Damage (any damage)",
        "H2": "Damage to roof(s) and/or chimney(s)",
        "H3": "Roof(s) destroyed",
        "H4": "Damage to window(s) and/or insulation layer(s)",
        "H5": "Wall(s) (partly) collapsed",
        "H6": "Building(s) (almost) fully destroyed",
        "H7": "Basement(s) flooded",
        "H8": "Flooding of ground floor",
        "H9": "Flooding above ground floor",
        "V1": "Car(s) damaged (any damage)",
        "V2": "Car(s) dented",
        "V3": "Car window(s) and/or windshield(s) broken",
        "V4": "Car(s) damaged beyond repair",
        "V5": "Car(s) lifted",
        "V6": "Truck(s) and/or trailer(s) overturned",
        "W1": "Tree(s) damaged",
        "W2": "Large tree branch(es) broken",
        "W3": "Tree(s) uprooted or snapped",
        "W4": "Forest(s) damaged or destroyed",
        "A1": "Crops/farmland damaged",
        "A2": "Farmland flooded",
        "A3": "Greenhouse(s) damaged or destroyed",
        "A4": "Animal(s) killed",
        "E1": "Land- or mudslide(s)",
        "E2": "Fire as a consequence of the event",
        "E3": "Evacuation order by authorities",
    }

class ImpactCodeEnum(str, Enum):
    T1 = "T1"
    T2 = "T2"
    T3 = "T3"
    T4 = "T4"
    T5 = "T5"
    T6 = "T6"
    T7 = "T7"
    T8 = "T8"
    T9 = "T9"
    T10 = "T10"
    T11 = "T11"
    T17 = "T17"
    I1 = "I1"
    I2 = "I2"
    H1 = "H1"
    H2 = "H2"
    H3 = "H3"
    H4 = "H4"
    H5 = "H5"
    H6 = "H6"
    H7 = "H7"
    H8 = "H8"
    H9 = "H9"
    V1 = "V1"
    V2 = "V2"
    V3 = "V3"
    V4 = "V4"
    V5 = "V5"
    V6 = "V6"
    W1 = "W1"
    W2 = "W2"
    W3 = "W3"
    W4 = "W4"
    A1 = "A1"
    A2 = "A2"
    A3 = "A3"
    A4 = "A4"
    E1 = "E1"
    E2 = "E2"
    E3 = "E3"

class InfoSourceEnum(str, Enum):
    WWW = "WWW"
    EMAIL = "EMAIL"
    DMGEYEWTN = "DMGEYEWTN"
    DMGPHOTO = "DMGPHOTO"
    NWSP = "NWSP"
    EYEWTN = "EYEWTN"
    TV = "TV"
    GOV = "GOV"
    WXSVC = "WXSVC"
    EVTPHOTO = "EVTPHOTO"
    SPTR = "SPTR"
    DMGSVY = "DMGSVY"

class EventDetails(BaseModel):
    qc_level: Optional[QcEnum] = None
    time_event: Optional[datetime] = None
    time_creation: Optional[datetime] = None
    time_last_revision: Optional[datetime] = None
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
    impacts: Optional[list[ImpactCodeEnum]] = []
    
    
    @field_validator('impacts', mode='before')
    def convert_str_to_list(cls, value):
        if isinstance(value, str):
            return re.findall(r'[A-Z]\d{1,2}', value)
        return value
    
class Source(BaseModel):
    info_source: Optional[list[InfoSourceEnum]] = None
    contact: Optional[str] = None
    organisation: Optional[str] = None
    organisation_id: Optional[str] = None
    no_revision: Optional[int] = None
    person_revision: Optional[str] = None
    creator_id: Optional[str] = None
    revisor_id: Optional[str] = None
    link_org: Optional[str] = None
    link_id: Optional[str] = None
    deleted: Optional[str] = None
    ext_url: Optional[str] = None
    reference: Optional[str] = None
    
    @field_validator('info_source', mode='before')
    def convert_str_to_list(cls, value):
        if isinstance(value, str):
            return value.split(';')
        return value

class HeavyRainResponse(BaseModel):
    id: int
    location: LocationDetails
    event: EventDetails
    source: Source

    class Config:
        orm_mode = True
        
    @classmethod
    def from_db(cls, heavy_rain: "HeavyRain") -> "HeavyRainResponse":
        """Converts a HeavyRain SQLAlchemy model instance into a nested HeavyRainResponse."""
        if not isinstance(heavy_rain, HeavyRain):
            raise TypeError(f"Expected a HeavyRain instance, got {type(heavy_rain).__name__}")

        return cls(
            id=getattr(heavy_rain, "id", None),
            location=LocationDetails(
                coordinates=Coordinates(
                    latitude=getattr(heavy_rain, "latitude", None),
                    longitude=getattr(heavy_rain, "longitude", None),
                ),
                country=getattr(heavy_rain, "country", None),
                state=getattr(heavy_rain, "state", None),
                place=getattr(heavy_rain, "place", None),
                place_local_language=getattr(heavy_rain, "place_local_language", None),
                place_accuracy=getattr(heavy_rain, "place_accuracy", None),
                surface_initial_location=getattr(heavy_rain, "surface_initial_location", None),
                surface_crossed=getattr(heavy_rain, "surface_crossed", None)
                ),
            event=EventDetails(
                qc_level=getattr(heavy_rain, "qc_level", None),
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
                impacts=getattr(heavy_rain, "impacts", [])
                ),
            source=Source(
                info_source=getattr(heavy_rain, "info_source", None),
                contact=getattr(heavy_rain, "contact", None),
                organisation=getattr(heavy_rain, "organisation", None),
                organisation_id=getattr(heavy_rain, "organisation_id", None),
                no_revision=getattr(heavy_rain, "no_revision", None),
                person_revision=getattr(heavy_rain, "person_revision", None),
                creator_id=getattr(heavy_rain, "creator_id", None),
                revisor_id=getattr(heavy_rain, "revisor_id", None),
                link_org=getattr(heavy_rain, "link_org", None),
                link_id=getattr(heavy_rain, "link_id", None),
                deleted=getattr(heavy_rain, "deleted", None),
                ext_url=getattr(heavy_rain, "ext_url", None),
                reference=getattr(heavy_rain, "reference", None)
            )
        )
        
class HeavyRainFilter(BaseModel):
    timeRange: Optional[conlist(date, min_length=2, max_length=2)] = None
    impactRange: Optional[conlist(int, min_length=2, max_length=2)] = None
    impactCodes: Optional[list[ImpactCodeEnum]] = None
    qcLevels: Optional[list[QcEnum]] = None
    infoSources: Optional[list[InfoSourceEnum]] = None
    
class HeavyRainPost(BaseModel):
    filters: HeavyRainFilter

class GeometryPost(BaseModel):
    geometry: dict
    