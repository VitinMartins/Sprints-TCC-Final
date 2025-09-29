import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { geocodeAddress } from '../api/geocode';
import { findClinics } from '../api/clinics';
import { getRoute } from '../api/route';

const DEFAULT_CENTER = { lat: -3.7327, lng: -38.5270 }; // Fortaleza

export default function MapaSection() {
  const { t } = useTranslation();
  const [endereco, setEndereco] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [userPosition, setUserPosition] = useState(null);

  const [addressPosition, setAddressPosition] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [route, setRoute] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(coords);
        setUserPosition(coords);
      },
      () => setCenter(DEFAULT_CENTER),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  async function handleBuscarEndereco() {
    setGeoError('');
    setIsLoading(true);
    try {
      const result = await geocodeAddress(endereco);
      const coords = { lat: result.lat, lng: result.lng };
      setAddressPosition(coords);
      setCenter(coords);

      if (especialidade.trim()) {
        const found = await findClinics(coords.lat, coords.lng, especialidade);
        setClinics(found);
      } else {
        setClinics([]);
      }
    } catch (err) {
      setAddressPosition(null);
      setClinics([]);
      setGeoError(err.message || 'Não foi possível localizar o endereço');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGerarRota(clinic) {
    if (!addressPosition) {
      alert('Informe e busque um endereço primeiro');
      return;
    }
    try {
      const geometry = await getRoute(addressPosition, { lat: clinic.lat, lng: clinic.lng });
      setRoute(geometry);
    } catch (err) {
      console.error(err);
      alert('Não foi possível gerar a rota');
    }
  }

  return (
    <div className="mapa-section">
      <h3>{t('localizarClinica')}</h3>

      <div className="mapa-form">
        <input
          type="text"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder={t('placeholderEndereco') || 'Digite seu endereço completo'}
          className="input"
        />
        <input
          type="text"
          value={especialidade}
          onChange={(e) => setEspecialidade(e.target.value)}
          placeholder={t('placeholderEspecialidade') || 'Ex: Cardiologia, Endocrinologia...'}
          className="input"
        />
        <button type="button" onClick={handleBuscarEndereco} className="btn-primary" disabled={isLoading}>
          {isLoading ? (t('buscando') || 'Buscando...') : (t('buscarEndereco') || 'Buscar endereço')}
        </button>
      </div>

      {geoError && <div className="error-box">{geoError}</div>}

      <div className="map-wrapper">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          style={{ height: '380px', width: '100%', borderRadius: 12 }}
          scrollWheelZoom
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {userPosition && (
            <Marker position={[userPosition.lat, userPosition.lng]}>
              <Popup>{t('voceEstaAqui') || 'Você está aqui'}</Popup>
            </Marker>
          )}

          {addressPosition && (
            <Marker position={[addressPosition.lat, addressPosition.lng]}>
              <Popup>{t('enderecoInformado') || 'Endereço informado'}</Popup>
            </Marker>
          )}

          {clinics.map((c) => (
            <Marker key={c.id} position={[c.lat, c.lng]}>
              <Popup>
                <strong>{c.name}</strong><br />
                {c.type}<br />
                <button onClick={() => handleGerarRota(c)} style={{ marginTop: '6px' }}>
                  {t('gerarRota') || 'Gerar rota'}
                </button>
              </Popup>
            </Marker>
          ))}

          {route && (
            <Polyline
              positions={route.coordinates.map(([lng, lat]) => [lat, lng])} // inversão corrigida
              color="blue"
              weight={4}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
