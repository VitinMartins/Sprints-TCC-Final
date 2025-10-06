// src/api/clinics.js
// Busca clínicas/hospitais próximos via Overpass API (OpenStreetMap)

export async function findClinics(lat, lng, specialty) {
  const radius = 5000; // 5 km
  const query = `
  [out:json];
  (
    node(around:${radius},${lat},${lng})["amenity"~"hospital|clinic"];
    node(around:${radius},${lat},${lng})["healthcare"~"clinic|hospital|doctor|general_practitioner"];
    way(around:${radius},${lat},${lng})["amenity"~"hospital|clinic"];
    way(around:${radius},${lat},${lng})["healthcare"~"clinic|hospital|doctor|general_practitioner"];
  );
  out center;
  `;

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'text/plain' },
  });

  if (!res.ok) throw new Error('Erro ao buscar clínicas');
  const data = await res.json();

  const items = (data.elements || [])
    .map(el => ({
      id: el.id,
      name: el.tags?.name || 'Centro de saúde',
      lat: el.lat || el.center?.lat,
      lng: el.lon || el.center?.lon,
      type: el.tags?.healthcare || el.tags?.amenity || 'clinic',
      tags: el.tags || {},
    }))
    .filter(el => el.lat && el.lng);

  const normalized = specialty.toLowerCase().trim();

  // Filtro mais robusto: só aceita estabelecimentos médicos reais
  const filtered = items.filter(i => {
    const text = `${i.name} ${Object.values(i.tags).join(' ')}`.toLowerCase();

    // Só considera se for hospital, clínica, consultório ou posto de saúde
    const isHealthFacility =
      i.type.includes('clinic') ||
      i.type.includes('hospital') ||
      i.type.includes('doctor') ||
      text.includes('posto de saúde') ||
      text.includes('centro de saúde') ||
      text.includes('hospital');

    // Combina com a especialidade, se fornecida
    const matchesSpecialty =
      normalized === '' ||
      text.includes(normalized) ||
      text.includes(normalized.replace('logia', ''));

    return isHealthFacility && matchesSpecialty;
  });

  return filtered.slice(0, 5); // retorna até 5 clínicas
}
