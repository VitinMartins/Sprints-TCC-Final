import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Mapa from "../components/Mapa";

export default function Home() {
  const [symptoms, setSymptoms] = useState("");
  const [address, setAddress] = useState("");
  const [selectedPosto, setSelectedPosto] = useState("");
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [origemMapa, setOrigemMapa] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const requireAuthAction = (callback) => {
    if (!user) {
      navigate("/cadastro");
    } else {
      callback();
    }
  };

  const postos = [
    { nome: "Posto Central", esp: "Cardiologia", endereco: "Rua A, 123", latitude: -3.73, longitude: -38.52 },
    { nome: "Posto Sul", esp: "Nefrologia", endereco: "Rua B, 456", latitude: -3.74, longitude: -38.55 },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    requireAuthAction(() => {
      if (!symptoms.trim()) {
        setErrorMessage("Por favor, informe seus sintomas.");
        setSuccessMessage("");
        return;
      }

      setResults([
        { name: "Diabetes", prob: "70%" },
        { name: "Anemia", prob: "20%" },
        { name: "Asma", prob: "10%" }
      ]);
      setSuccessMessage("Previsão realizada com sucesso!");
      setErrorMessage("");
    });
  };

  const mostrarRota = async () => {
    requireAuthAction(async () => {
      if (!address || !selectedPosto) {
        setErrorMessage("Informe seu endereço e selecione um posto.");
        setSuccessMessage("");
        return;
      }

      try {
        const response = await fetch(`https://api.distancematrix.ai/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=iFiDbjH62rcRPvJzsOTFMXgSYZRO71iTifqAsusuEyh9ujT6rpRLmyvbsUNkNMFA`);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
          setErrorMessage("Endereço não encontrado.");
          setSuccessMessage("");
          return;
        }

        const location = data.results[0].geometry.location;
        setOrigemMapa([location.lat, location.lng]);
        setSuccessMessage("Rota gerada com sucesso!");
        setErrorMessage("");
        setMostrarMapa(true);
      } catch (error) {
        console.error("Erro ao buscar coordenadas:", error);
        setErrorMessage("Falha ao buscar localização.");
        setSuccessMessage("");
      }
    });
  };

  const destino = selectedPosto
    ? [
        parseFloat(selectedPosto.split(",")[0]),
        parseFloat(selectedPosto.split(",")[1])
      ]
    : null;
  const nomePosto = selectedPosto ? selectedPosto.split(",")[2] : "";

  return (
    <div className="fadeIn">
      <h1>PreviMed</h1>

      <form onSubmit={handleSubmit}>
        {errorMessage && <div className="error-box fadeIn">{errorMessage}</div>}
        {successMessage && <div className="success-box fadeIn">{successMessage}</div>}

        <label>Digite seus sintomas (separados por vírgula):</label>
        <input
          type="text"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Ex: dor de cabeça, tosse, etc."
          required
        />
        <button type="submit">Prever</button>

        <label>Seu endereço:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ex: Rua João Pessoa, 123, Fortaleza - CE"
        />

        <label>Escolha um posto:</label>
        <select
          value={selectedPosto}
          onChange={(e) => setSelectedPosto(e.target.value)}
        >
          <option value="">Selecione</option>
          {postos.map((p, i) => (
            <option key={i} value={`${p.latitude},${p.longitude},${p.nome}`}>
              {p.nome} ({p.esp})
            </option>
          ))}
        </select>

        <button type="button" onClick={mostrarRota}>Mostrar Rota</button>
      </form>

      <div id="resultados" className="fadeInUp">
        <h2>Resultados</h2>
        <ul>
          {results.map((r, i) => (
            <li key={i}><strong>{r.name}</strong> — {r.prob}</li>
          ))}
        </ul>
      </div>

      {mostrarMapa && origemMapa && destino && (
        <Mapa origem={origemMapa} destino={destino} nomePosto={nomePosto} />
      )}
    </div>
  );
}
