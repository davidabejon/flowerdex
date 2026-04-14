const axios = require('axios');

function pickTagsFromTrefle(plant) {
  const tags = new Set();
  if (!plant) return [];
  if (plant.common_name) plant.common_name.split(/\s+/).forEach(w => { if (w.length > 2) tags.add(w); });
  if (plant.scientific_name) plant.scientific_name.split(/\s+/).forEach(w => { if (w.length > 2) tags.add(w); });
  if (plant.family_common_name) tags.add(plant.family_common_name);
  if (plant.genus) tags.add(plant.genus);
  if (plant.duration) tags.add(plant.duration);
  if (plant.growth_form) tags.add(plant.growth_form);
  if (plant.main_species && plant.main_species.flower && plant.main_species.flower.color) {
    const c = plant.main_species.flower.color;
    if (Array.isArray(c)) c.forEach(col => tags.add(col));
    else if (typeof c === 'string') tags.add(c);
  }
  return Array.from(tags).slice(0, 10);
}

async function enrichSpecies(species) {
  if (!species) return { trefle: null, description: null, tags: [] };

  const result = { trefle: null, description: null, tags: [] };

  const trefleToken = process.env.TREFLE_TOKEN;
  if (trefleToken && species !== 'Unknown') {
    try {
      const q = encodeURIComponent(species);
      // First try: token as query param (old-style)
      let resp;
      try {
        resp = await axios.get(`https://trefle.io/api/v1/plants/search?token=${trefleToken}&q=${q}`, { timeout: 10000 });
      } catch (err) {
        // If unauthorized or bad request, try with Authorization header (Bearer)
        const status = err && err.response && err.response.status;
        const data = err && err.response && err.response.data;
        console.warn('Trefle query (param) failed', { status, data });
        if (status === 401 || status === 403 || status === 400) {
          try {
            resp = await axios.get(`https://trefle.io/api/v1/plants/search?q=${q}`, { headers: { Authorization: `Bearer ${trefleToken}` }, timeout: 10000 });
          } catch (err2) {
            const s2 = err2 && err2.response && err2.response.status;
            const d2 = err2 && err2.response && err2.response.data;
            console.warn('Trefle query (bearer) failed', { s2, d2 });
            throw err2;
          }
        } else {
          throw err;
        }
      }

      const first = resp.data && resp.data.data && resp.data.data[0];
      let detailed = first;
      if (first && first.links && first.links.self) {
        try {
          // Try fetching the detailed species record from the self link
          let detailsResp;
          try {
            detailsResp = await axios.get(`https://trefle.io${first.links.self}`, { headers: { Authorization: `Bearer ${trefleToken}` }, timeout: 10000 });
          } catch (errDetails) {
            // fallback to token-as-param for older tokens/endpoints
            detailsResp = await axios.get(`https://trefle.io${first.links.self}?token=${trefleToken}`, { timeout: 10000 });
          }
          if (detailsResp && detailsResp.data) {
            // the detailed object is usually under data
            if (detailsResp.data.data) detailed = detailsResp.data.data;
            else detailed = detailsResp.data;
          }
        } catch (errD) {
          console.warn('Trefle details fetch failed', errD?.message || errD);
        }
      }

      if (detailed) {
        // trim to only requested fields to avoid storing whole API response
        try {
          const allowed = ['edible','edible_part','family','family_common_name','flower','foliage','fruit_or_seed','genus','image_url','images','links','status','vegetable','year'];
          const trimmed = {};
          allowed.forEach(k => {
            trimmed[k] = (detailed && (k in detailed)) ? detailed[k] : ((first && (k in first)) ? first[k] : null);
          });
          result.trefle = trimmed;
        } catch (trimErr) {
          result.trefle = null;
        }

        // extract only Spanish and English common names (es/spa and en/eng)
        try {
          const cn = detailed.common_names || null;
          let spanish = null;
          let english = null;
          if (cn) {
            const esVal = cn.es || cn.spa || cn['es'] || cn['spa'];
            if (Array.isArray(esVal) && esVal.length) spanish = esVal[0];
            else if (typeof esVal === 'string' && esVal) spanish = esVal;

            const enVal = cn.en || cn.eng || cn['en'] || cn['eng'];
            if (Array.isArray(enVal) && enVal.length) english = enVal[0];
            else if (typeof enVal === 'string' && enVal) english = enVal;
          }
          result.trefle.common_names = { es: spanish || null, en: english || null };
        } catch (e) {
          result.trefle.common_names = { es: null, en: null };
        }

        // result.trefle.tags = pickTagsFromTrefle(detailed).map(String);
      }
    } catch (e) {
      console.warn('Trefle enrichment failed', e?.message || e);
      result.trefle = null;
    }
  }

  const gardenKey = process.env.GARDEN_API_KEY;
  if (gardenKey && species !== 'Unknown') {
    try {
      // Placeholder for Garden API call: could fill more tags or characteristics
    } catch (e) {
      // ignore
    }
  }

  return result;
}

module.exports = { enrichSpecies };
