// src/api/clinics.js
// Busca clínicas/hospitais próximos via Overpass API (OpenStreetMap)

export async function findClinics(lat, lng, specialty) {
  const radius = 5000; // 5 km
  const query = `
  [out:json];
  (
    node(around:${radius},${lat},${lng})["healthcare"];
    node(around:${radius},${lat},${lng})["amenity"="hospital"];
    node(around:${radius},${lat},${lng})["amenity"="clinic"];
  );
  out center;`;

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'text/plain' },
  });

  if (!res.ok) throw new Error('Erro ao buscar clínicas');

  const data = await res.json();
  const items = (data.elements || []).map(el => ({
    id: el.id,
    name: el.tags?.name || 'Centro de saúde',
    lat: el.lat || el.center?.lat,
    lng: el.lon || el.center?.lon,
    type: el.tags?.healthcare || el.tags?.amenity || 'clinic',
    tags: el.tags || {},
  }));

  // Filtro simples por especialidade no nome ou tags
  const normalized = specialty.toLowerCase();
  const filtered = items.filter(i => {
    const text = `${i.name} ${Object.values(i.tags).join(' ')}`.toLowerCase();
    return text.includes(normalized) || normalized === 'clinico geral';
  });

  return filtered.slice(0, 10); // limita a 10 resultados
}
