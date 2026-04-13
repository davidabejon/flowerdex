# Flowerdex Backend

Express + SQLite backend for uploading flower photos, identifying species, and enriching with botanical APIs.

Setup

1. Install dependencies

```bash
cd backend
npm install
```

2. Copy `.env.example` to `.env` and add any API keys you have (PlantNet, Perenual, Trefle, Garden API).

3. Run

```bash
npm run dev
```

Endpoints

- `POST /upload` - multipart form with field `photo`. Returns saved DB record with identification/enrichment metadata.
- `GET /photos` - list saved photos
- `GET /photos/:id` - get a saved photo record

Notes

- The identification service uses PlantNet when `PLANTNET_API_KEY` is set. Adjust `services/identify.js` and `services/enrich.js` to match exact provider requirements or to add other providers.
