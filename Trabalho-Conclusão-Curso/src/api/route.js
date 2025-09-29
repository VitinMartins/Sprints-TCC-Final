// src/api/route.js
// Consulta rota entre dois pontos usando OSRM (Open Source Routing Machine)

export async function getRoute(start, end) {
  const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro ao buscar rota');

  const data = await res.json();
  if (!data.routes || data.routes.length === 0) {
    throw new Error('Nenhuma rota encontrada');
  }

  return data.routes[0].geometry; // GeoJSON da linha da rota
}
