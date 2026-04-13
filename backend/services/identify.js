const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function identifyImage(filePath) {
  // Use PlantNet if API key provided
  const plantNetKey = process.env.PLANTNET_API_KEY || process.env.PLANT_ID_API_KEY; // fallback if user still has old var
  if (plantNetKey) {
    try {
      const url = `https://my-api.plantnet.org/v2/identify/all?api-key=${encodeURIComponent(plantNetKey)}`;
      const form = new FormData();
      form.append('images', fs.createReadStream(filePath));
      // optional: add organs or language
      form.append('organs', 'flower');

      const resp = await axios.post(url, form, { headers: form.getHeaders(), timeout: 20000 });
      const first = resp.data?.results?.[0];
      if (first) {
        const speciesObj = first?.species || first?.content?.species;
        let species = null;
        if (speciesObj) {
          species = speciesObj.scientificNameWithoutAuthor || speciesObj.scientificName || (speciesObj.commonNames && speciesObj.commonNames[0]) || null;
        }
        const confidence = typeof first.score === 'number' ? first.score : (first.probability || 0);
        return { species: species || 'Unknown', confidence: confidence || 0, raw: resp.data };
      }
    } catch (e) {
      console.error('PlantNet request failed:', e?.message || e);
    }
  }

  // Perenual stub (if key provided you can implement call)
  const perenualKey = process.env.PERENUAL_KEY;
  if (perenualKey) {
    try {
      // Placeholder: Perenual usually requires multipart upload; leaving as stub
      return { species: null, confidence: 0, raw: null };
    } catch (e) {
      console.error('Perenual request failed:', e?.message || e);
    }
  }

  // Fallback: unknown
  return { species: 'Unknown', confidence: 0, raw: null };
}

module.exports = { identifyImage };
