from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class Photo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    filename: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    species_name: Optional[str] = None
    plant_id_score: Optional[float] = None
    plant_id_raw: Optional[str] = None
    trefle_data: Optional[str] = None
    garden_data: Optional[str] = None
