from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import (
    String, Integer, Float, DateTime
)
from datetime import datetime
from pydantic import BaseModel, ValidationError, Field, field_validator


class TripRecord(BaseModel):
    id: str
    vendor_id: int
    pickup_datetime: datetime
    dropoff_datetime: datetime
    passenger_count: int
    pickup_longitude: float = Field(ge=-180, le=180)
    pickup_latitude: float = Field(ge=-90, le=90)
    dropoff_longitude: float = Field(ge=-180, le=180)
    dropoff_latitude: float = Field(ge=-90, le=90)
    store_and_fwd_flag: str
    trip_duration: int
    distance: float = Field(ge=0, description="Distance in kilometers")

    @field_validator("id")
    @classmethod
    def validate_id_format(cls, id_value: str) -> str:
        if not id_value.startswith("id") or not id_value[2:].isdigit():
            raise ValueError("id must start with 'id' followed by digits")
        return id_value


class Base(DeclarativeBase):
    pass


class TripModel(Base):
    __tablename__ = "trips"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    vendor_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    pickup_datetime: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    dropoff_datetime: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, index=True)
    passenger_count: Mapped[int] = mapped_column(Integer, nullable=False)
    pickup_longitude: Mapped[float] = mapped_column(Float, nullable=False)
    pickup_latitude: Mapped[float] = mapped_column(Float, nullable=False)
    dropoff_longitude: Mapped[float] = mapped_column(Float, nullable=False)
    dropoff_latitude: Mapped[float] = mapped_column(Float, nullable=False)
    store_and_fwd_flag: Mapped[str] = mapped_column(String(1), nullable=False)
    trip_duration: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    distance: Mapped[float] = mapped_column(Float, nullable=False, index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "vendor_id": self.vendor_id,
            "pickup_datetime": self.pickup_datetime.isoformat(),
            "dropoff_datetime": self.dropoff_datetime.isoformat(),
            "passenger_count": self.passenger_count,
            "pickup_longitude": self.pickup_longitude,
            "pickup_latitude": self.pickup_latitude,
            "dropoff_longitude": self.dropoff_longitude,
            "dropoff_latitude": self.dropoff_latitude,
            "store_and_fwd_flag": self.store_and_fwd_flag,
            "trip_duration": self.trip_duration,
            "distance": self.distance,
        }
