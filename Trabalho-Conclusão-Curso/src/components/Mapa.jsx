import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Mapa({ origem, destino, nomePosto }) {
  const iconUser = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const iconPosto = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const route = [origem, destino];

  return (
    <div id="mapa" className="fadeInUp">
      <MapContainer center={origem} zoom={14} style={{ height: "100%", width: "100%", borderRadius: "12px" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={origem} icon={iconUser}>
          <Popup>Você</Popup>
        </Marker>
        <Marker position={destino} icon={iconPosto}>
          <Popup>{nomePosto}</Popup>
        </Marker>
        <Polyline positions={route} color="#0f4c81" />
      </MapContainer>
    </div>
  );
}
