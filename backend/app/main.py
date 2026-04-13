import os
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from .database import create_db_and_tables, get_session
from .crud import create_photo, list_photos, get_photo, update_photo_enrichment
from .external_apis import identify_species, enrich_with_trefle, enrich_with_garden
from sqlmodel import Session
import shutil
import json

UPLOADS_DIR = os.getenv("UPLOADS_DIR", "uploads")
Path(UPLOADS_DIR).mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Flowerdex Backend")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.post("/upload")
async def upload_photo(file: UploadFile = File(...), background_tasks: BackgroundTasks = None, session: Session = Depends(get_session)):
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")
    ext = Path(file.filename).suffix or ".jpg"
    import uuid
    fname = f"{uuid.uuid4().hex}{ext}"
    fpath = Path(UPLOADS_DIR) / fname
    with open(fpath, "wb") as f:
        f.write(content)

    result = await identify_species(content)
    species_name = None
    score = None
    raw = None
    try:
        raw = json.dumps(result)
        # try extract common name
        if isinstance(result, dict) and result.get("suggestions"):
            top = result["suggestions"][0]
            species_name = top.get("plant_name") or top.get("plant" )
            score = float(top.get("probability", 0))
        elif isinstance(result, dict) and result.get("id"):
            species_name = result.get("id")
    except Exception:
        raw = json.dumps({"error": "parsing"})

    photo = create_photo(session, filename=str(fpath), species_name=species_name, plant_id_score=score, plant_id_raw=raw)

    if background_tasks is not None:
        background_tasks.add_task(_background_enrich, photo.id, species_name or "", session)

    return {"id": photo.id, "filename": photo.filename, "species_name": photo.species_name}


def _background_enrich(photo_id: int, species_query: str, session: Session):
    import asyncio

    async def _run():
        trefle = await enrich_with_trefle(species_query)
        garden = await enrich_with_garden(species_query)
        update_photo_enrichment(session, photo_id, trefle_data=json.dumps(trefle) if trefle else None, garden_data=json.dumps(garden) if garden else None)

    asyncio.run(_run())


@app.get("/photos")
def api_list_photos(session: Session = Depends(get_session)):
    return list_photos(session)


@app.get("/photos/{photo_id}")
def api_get_photo(photo_id: int, session: Session = Depends(get_session)):
    p = get_photo(session, photo_id)
    if not p:
        raise HTTPException(status_code=404, detail="Not found")
    return p
