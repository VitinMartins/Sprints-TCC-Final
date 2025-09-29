// src/api/geocode.js
// Geocodificação via Nominatim (OpenStreetMap)
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

// Opcional: coloque seu e-mail para cumprir política da Nominatim (melhora confiabilidade)
const CONTACT_EMAIL = 'vitinhuman@gmail.com'; // ex: 'seuemail@exemplo.com'

export async function geocodeAddress(query) {
  if (!query || query.trim().length < 5) {
    throw new Error('Endereço muito curto');
  }

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '1',
    limit: '1',
    countrycodes: 'br', // prioriza Brasil
    email: CONTACT_EMAIL || undefined, // envia se você preencher
  });

  const url = `${NOMINATIM_URL}?${params.toString()}`;
  const res = await fetch(url, { method: 'GET' });

  if (!res.ok) {
    throw new Error('Falha ao geocodificar o endereço');
  }

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Endereço não encontrado');
  }

  const first = data[0];
  return {
    lat: parseFloat(first.lat),
    lng: parseFloat(first.lon),
    displayName: first.display_name,
    raw: first,
  };
}
