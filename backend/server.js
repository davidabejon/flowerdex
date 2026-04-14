require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { identifyImage } = require('./services/identify');
const { enrichSpecies } = require('./services/enrich');
const db = require('./db');

const app = express();
// Simple CORS for development
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    return res.sendStatus(200);
  }
  next();
});
const PORT = process.env.PORT || 4000;

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const filePath = req.file.path;
    const identification = await identifyImage(filePath);
    const enrichment = await enrichSpecies(identification.species);

    const metadata = { identification, enrichment };

    const insert = await db.run(
      'INSERT INTO photos (filename, species, confidence, metadata) VALUES (?, ?, ?, ?)',
      [req.file.filename, identification.species, identification.confidence || 0, JSON.stringify(metadata)]
    );

    const saved = await db.get('SELECT * FROM photos WHERE id = ?', [insert.id]);
    res.json({ success: true, photo: saved, uploadsPath: `/uploads/${req.file.filename}` });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/photos', async (req, res) => {
  try {
    // pagination: ?page=1&per_page=20
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const perPage = Math.min(100, Math.max(1, parseInt(req.query.per_page, 10) || 20));
    const offset = (page - 1) * perPage;

    const totalRow = await db.get('SELECT COUNT(*) as cnt FROM photos');
    const total = totalRow ? totalRow.cnt || 0 : 0;
    const rows = await db.all('SELECT id, filename, species FROM photos ORDER BY created_at DESC LIMIT ? OFFSET ?', [perPage, offset]);

    res.json({
      photos: rows.map(r => ({ id: r.id, filename: r.filename, species: r.species })),
      page,
      per_page: perPage,
      total,
      total_pages: Math.ceil(total / perPage)
    });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/photos/:id', async (req, res) => {
  try {
    const row = await db.get('SELECT * FROM photos WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    row.metadata = row.metadata ? JSON.parse(row.metadata) : null;
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Return only enrichment details (and basic photo info) for a single photo
app.get('/photos/:id/details', async (req, res) => {
  try {
    const row = await db.get('SELECT id, filename, species, metadata, created_at FROM photos WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    let metadata = null;
    try { metadata = row.metadata ? JSON.parse(row.metadata) : null; } catch (err) { metadata = null; }
    const enrichment = metadata && metadata.enrichment ? metadata.enrichment : null;
    res.json({ photo: { id: row.id, filename: row.filename, species: row.species, created_at: row.created_at }, enrichment });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/photos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const row = await db.get('SELECT * FROM photos WHERE id = ?', [id]);
    if (!row) return res.status(404).json({ error: 'Not found' });

    // delete DB record
    await db.run('DELETE FROM photos WHERE id = ?', [id]);

    // delete file from uploads
    const filePath = path.join(UPLOAD_DIR, row.filename);
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
      console.warn('Failed to delete file:', filePath, err?.message || err);
    }

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => console.log(`Flowerdex backend listening on port ${PORT}`));
