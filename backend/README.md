Backend para Flowerdex (FastAPI)

Rutas principales:
- `POST /upload` : sube una foto, identifica especie y guarda en DB.
- `GET /photos` : lista fotos.
- `GET /photos/{id}` : detalle.

Configurar variables de entorno en `.env` (ver `.env.example`).

Instalación:
```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
