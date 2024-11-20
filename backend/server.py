from typing import Annotated

from fastapi import APIRouter, FastAPI, Query
from geoalchemy2 import Geography
from sqlalchemy import create_engine, func, select
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker

from CarSharingResponse import CarSharingResponse
from settings import settings

DATABASE_URL = settings.database_url

app = FastAPI()
router = APIRouter(prefix="/api")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = automap_base()
Base.prepare(engine, reflect=True)

CarSharing = Base.classes.car_sharing


@app.get("/health")
async def health():
    return {"status": "ok"}


@router.get("/car-sharing")
async def car_sharing():
    with SessionLocal() as session:
        sharing_query = select(
            CarSharing.name,
            CarSharing.street,
            CarSharing.streetnr,
            CarSharing.districtna,
            func.ST_Y(CarSharing.wkb_geometry).label("latitude"),
            func.ST_X(CarSharing.wkb_geometry).label("longitude"),
            CarSharing.capacity,
            CarSharing.provider,
        ).order_by(CarSharing.name)

        sharing = session.execute(sharing_query).all()

    return convert_car_sharing_entities(sharing)


@router.get("/car-sharing/capacity")
async def car_sharing_capacity(districts: Annotated[list[str] | None, Query()] = None):
    print(districts)

    with SessionLocal() as session:
        sharing_capacities_query = select(
            CarSharing.name,
            CarSharing.street,
            CarSharing.streetnr,
            CarSharing.districtna,
            CarSharing.capacity,
            CarSharing.provider,
        ).order_by(CarSharing.capacity.desc())

        if districts is not None:
            sharing_capacities_query = sharing_capacities_query.filter(
                CarSharing.districtna.in_(districts)
            )

        sharing_capacities = session.execute(sharing_capacities_query).all()

    return convert_car_sharing_entities(sharing_capacities)


@router.get("/car-sharing/points")
async def car_sharing_points(latitude: float = None, longitude: float = None):
    with SessionLocal() as session:
        if latitude is None or longitude is None:
            sharing_points_query = select(
                CarSharing.name,
                CarSharing.street,
                CarSharing.streetnr,
                func.ST_Y(CarSharing.wkb_geometry).label("latitude"),
                func.ST_X(CarSharing.wkb_geometry).label("longitude"),
                CarSharing.capacity,
                CarSharing.provider,
                CarSharing.picture,
            ).order_by(CarSharing.name)
        else:
            sharing_points_query = select(
                CarSharing.name,
                CarSharing.street,
                CarSharing.streetnr,
                func.ST_Y(CarSharing.wkb_geometry).label("latitude"),
                func.ST_X(CarSharing.wkb_geometry).label("longitude"),
                CarSharing.capacity,
                CarSharing.provider,
                func.ST_Distance(
                    CarSharing.wkb_geometry,
                    func.ST_SetSRID(func.ST_MakePoint(longitude, latitude), 4326).cast(
                        Geography
                    ),
                ).label("distance"),
                CarSharing.picture,
            ).order_by("distance")

        sharing_points = session.execute(sharing_points_query).all()

    return convert_car_sharing_entities(sharing_points)


@router.get("/car-sharing/providers")
async def car_sharing_providers():
    with SessionLocal() as session:
        sharing_providers_query = (
            select(CarSharing.provider).distinct().order_by(CarSharing.provider)
        )
        sharing_providers = session.execute(sharing_providers_query).scalars().all()

        return sharing_providers


def convert_car_sharing_entities(entities):
    converted_entities = []
    for entity in entities:
        converted_entities.append(
            CarSharingResponse.model_validate(entity).model_dump(
                exclude={"street", "street_number"}, exclude_none=True
            )
        )

    return converted_entities


app.include_router(router)
