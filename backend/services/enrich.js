const axios = require('axios');

async function enrichSpecies(species) {
  if (!species) return { trefle: null, garden: null };

  const result = { trefle: null, garden: null };

  const trefleToken = process.env.TREFLE_TOKEN;
  if (trefleToken && species !== 'Unknown') {
    try {
      const q = encodeURIComponent(species);
      const resp = await axios.get(`https://trefle.io/api/v1/plants/search?token=${trefleToken}&q=${q}`, { timeout: 10000 });
      result.trefle = resp.data;
    } catch (e) {
      result.trefle = null;
    }
  }

  const gardenKey = process.env.GARDEN_API_KEY;
  if (gardenKey && species !== 'Unknown') {
    try {
      // Placeholder for Garden API call
      result.garden = null;
    } catch (e) {
      result.garden = null;
    }
  }

  return result;
}

module.exports = { enrichSpecies };
