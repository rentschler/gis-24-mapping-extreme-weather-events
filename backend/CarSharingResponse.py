from typing import Dict

from functools import cached_property
from pydantic import BaseModel, computed_field, ConfigDict, Field

from EmptyStrToNone import EmptyStrToNone


class CarSharingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    capacity: int
    distance: float = Field(None)
    district: str = Field(None, alias="districtna")
    latitude: float = Field(None)
    longitude: float = Field(None)
    name: str
    picture: EmptyStrToNone | str = Field(None)
    provider: str
    street: str
    street_number: str = Field(None, alias="streetnr")

    @computed_field(repr=False)
    @cached_property
    def address(self) -> Dict[str, str]:
        return {"street": self.street, "number": self.street_number}
