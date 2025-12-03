import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { geocodeAddress } from '../api/geocode';
import { findClinics } from '../api/clinics';
import { getRoute } from '../api/route';
import L from 'leaflet';

// Ícone azul (usuário)
const userIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

// Ícone vermelho (clínica)
const clinicIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const DEFAULT_CENTER = { lat: -3.7327, lng: -38.5270 }; // Fortaleza

export default function MapaSection({ doencaPrevista = null }) {
  const { t } = useTranslation();

  const [endereco, setEndereco] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [userPosition, setUserPosition] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [route, setRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [noClinicsFound, setNoClinicsFound] = useState(false);

  // Captura localização do usuário ao abrir o mapa
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCenter(DEFAULT_CENTER),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  // 🟢 USAR AUTOMATICAMENTE A ESPECIALIDADE DA DOENÇA PREVISTA
  useEffect(() => {
    if (doencaPrevista) {
      console.log("Especialidade aplicada automaticamente:", doencaPrevista.especialidade);

      // Preenche automaticamente o campo
      setEspecialidade(doencaPrevista.especialidade);
    }
  }, [doencaPrevista]);

  async function handleBuscarEndereco() {
    setGeoError('');
    setIsLoading(true);
    setRoute(null);
    setNoClinicsFound(false);

    try {
      const result = await geocodeAddress(endereco);
      const coords = { lat: result.lat, lng: result.lng };

      setUserPosition(coords);
      setCenter(coords);

      // Só busca clínicas se houver especialidade (da previsão ou digitada)
      if (especialidade.trim().length > 0) {
        console.log("Buscando clínicas por especialidade:", especialidade);

        const found = await findClinics(coords.lat, coords.lng, especialidade);

        setClinics(found);

        if (!found || found.length === 0) {
          console.warn("Nenhuma clínica encontrada.");
          setNoClinicsFound(true);
        }
      } else {
        setClinics([]);
        setNoClinicsFound(true);
      }
    } catch (err) {
      setUserPosition(null);
      setClinics([]);
      setGeoError(err.message || 'Não foi possível localizar o endereço.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGerarRota(clinic) {
    if (!userPosition) {
      alert("Informe e busque seu endereço primeiro.");
      return;
    }

    try {
      const geometry = await getRoute(userPosition, { lat: clinic.lat, lng: clinic.lng });
      setRoute(geometry);
    } catch (err) {
      console.error(err);
      alert("Não foi possível gerar a rota.");
    }
  }

  return (
    <div className="mapa-section">
      <div className="mapa-form">
        <input
          type="text"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Digite seu endereço completo"
          className="input"
        />

        <input
          type="text"
          value={especialidade}
          onChange={(e) => setEspecialidade(e.target.value)}
          placeholder="Especialidade médica"
          className="input"
        />

        <button
          type="button"
          onClick={handleBuscarEndereco}
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "Buscando..." : "Buscar endereço"}
        </button>
      </div>

      {geoError && <div className="error-box">{geoError}</div>}
      {noClinicsFound && (
        <div className="info-box">
          Nenhuma clínica ou hospital encontrado para a especialidade informada.
        </div>
      )}

      <div className="map-wrapper">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          style={{ height: '380px', width: '100%', borderRadius: 12 }}
          scrollWheelZoom
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Ponto do usuário */}
          {userPosition && (
            <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon}>
              <Popup>Você está aqui</Popup>
            </Marker>
          )}

          {/* Clínicas encontradas */}
          {clinics.map((c) => (
            <Marker key={c.id} position={[c.lat, c.lng]} icon={clinicIcon}>
              <Popup>
                <strong>{c.name}</strong>
                <br />
                {c.type}
                <br />

                <button
                  type="button"
                  style={{ marginTop: 6 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleGerarRota(c);
                  }}
                >
                  Gerar rota
                </button>
              </Popup>
            </Marker>
          ))}

          {/* Rota */}
          {route && (
            <Polyline
              positions={route.coordinates.map(([lng, lat]) => [lat, lng])}
              color="blue"
              weight={4}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
