from sqlmodel import Session, select
from .models import Photo

def create_photo(session: Session, filename: str, species_name: str | None = None, plant_id_score: float | None = None, plant_id_raw: str | None = None):
    photo = Photo(filename=filename, species_name=species_name, plant_id_score=plant_id_score, plant_id_raw=plant_id_raw)
    session.add(photo)
    session.commit()
    session.refresh(photo)
    return photo

def update_photo_enrichment(session: Session, photo_id: int, trefle_data: str | None = None, garden_data: str | None = None):
    photo = session.get(Photo, photo_id)
    if not photo:
        return None
    if trefle_data is not None:
        photo.trefle_data = trefle_data
    if garden_data is not None:
        photo.garden_data = garden_data
    session.add(photo)
    session.commit()
    session.refresh(photo)
    return photo

def list_photos(session: Session):
    statement = select(Photo).order_by(Photo.uploaded_at.desc())
    return session.exec(statement).all()

def get_photo(session: Session, photo_id: int):
    return session.get(Photo, photo_id)
