import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Rota() {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const requireAuthAction = (callback) => {
    if (!user) {
      navigate("/cadastro");
    } else {
      callback();
    }
  };

  const buscarRota = () => {
    requireAuthAction(() => {
      console.log("Endereço digitado:", address);
      alert("Aqui futuramente vai aparecer o mapa com a rota até o posto mais próximo!");
    });
  };

  return (
    <div className="rota-container fadeIn">
      <h2>Mapa dos Postos de Saúde e Rota</h2>

      <label>Digite seu endereço:</label>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Digite seu endereço aqui"
      />
      <button onClick={buscarRota}>Mostrar Rota até Posto Mais Próximo</button>

      <div id="mapa"></div>
    </div>
  );
}
