from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker
from settings import settings
DATABASE_URL = settings.database_url

app = FastAPI()
engine = create_engine(DATABASE_URL)
print(f"Connected to database: {DATABASE_URL}")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = automap_base()
Base.prepare(engine, reflect=True)

CarSharing = Base.classes.car_sharing


@app.get("/health")
async def health():
    return {"status": "ok"}
