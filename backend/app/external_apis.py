import os
import base64
import json
from typing import Optional
import httpx

PLANT_ID_KEY = os.getenv("PLANT_ID_API_KEY")
PERENUAL_KEY = os.getenv("PERENUAL_API_KEY")
TREFLE_KEY = os.getenv("TREFLE_API_KEY")
GARDEN_KEY = os.getenv("GARDEN_API_KEY")
GARDEN_URL = os.getenv("GARDEN_API_URL")

async def identify_species(image_bytes: bytes) -> dict:
    if PLANT_ID_KEY:
        img_b64 = base64.b64encode(image_bytes).decode("utf-8")
        payload = {"api_key": PLANT_ID_KEY, "images": [img_b64], "modifiers": ["crops_fast"], "plant_details": ["common_names"]}
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.post("https://api.plant.id/v2/identify", json=payload)
            return r.json()
    if PERENUAL_KEY:
        async with httpx.AsyncClient(timeout=30) as client:
            files = {"image": ("upload.jpg", image_bytes, "image/jpeg")}
            headers = {"X-API-KEY": PERENUAL_KEY}
            r = await client.post("https://perenual.com/api/identify", headers=headers, files=files)
            return r.json()
    return {"error": "no_api_key"}

async def enrich_with_trefle(query: str) -> Optional[dict]:
    if not TREFLE_KEY:
        return None
    params = {"q": query}
    headers = {"Authorization": f"Bearer {TREFLE_KEY}"}
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.get("https://trefle.io/api/v1/species/search", params=params, headers=headers)
        return r.json()

async def enrich_with_garden(query: str) -> Optional[dict]:
    if not GARDEN_KEY and not GARDEN_URL:
        return None
    async with httpx.AsyncClient(timeout=20) as client:
        if GARDEN_URL:
            r = await client.get(GARDEN_URL, params={"q": query, "key": GARDEN_KEY})
            return r.json()
        return None
