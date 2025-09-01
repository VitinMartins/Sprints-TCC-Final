import { useState } from "react";

export default function Rota() {
  const [address, setAddress] = useState("");

  const buscarRota = () => {
    console.log("Endereço digitado:", address);
    alert("Aqui futuramente vai aparecer o mapa com a rota até o posto mais próximo!");
  };

  return (
    <div className="rota-container">
      <h2>Mapa dos Postos de Saúde e Rota</h2>

      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Digite seu endereço aqui"
      />
      <button onClick={buscarRota}>Mostrar Rota até Posto Mais Próximo</button>

      <div id="map"></div>
    </div>
  );
}
