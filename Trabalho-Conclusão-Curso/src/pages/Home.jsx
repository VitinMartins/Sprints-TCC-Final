import { useState } from "react";

export default function Home() {
  const [symptoms, setSymptoms] = useState("");
  const [address, setAddress] = useState("");
  const [selectedPosto, setSelectedPosto] = useState("");
  const [results, setResults] = useState([]);

  const postos = [
    // por enquanto mock, no futuro vem do backend
    { nome: "Posto Central", esp: "Cardiologia", endereco: "Rua A, 123", latitude: -3.73, longitude: -38.52 },
    { nome: "Posto Sul", esp: "Nefrologia", endereco: "Rua B, 456", latitude: -3.74, longitude: -38.55 },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui futuramente chamaremos a API Flask
    setResults([
      { name: "Diabetes", prob: "70%" },
      { name: "Anemia", prob: "20%" },
      { name: "Asma", prob: "10%" }
    ]);
  };

  const mostrarRota = () => {
    console.log("Endereço usuário:", address);
    console.log("Posto escolhido:", selectedPosto);
    alert("Aqui no futuro vai aparecer o mapa com a rota!");
  };

  return (
    <div className="container">
      <h1>--PreviMed--</h1>

      <form onSubmit={handleSubmit}>
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
            <option key={i} value={`${p.latitude},${p.longitude},${p.nome},${p.endereco}`}>
              {p.nome} ({p.esp})
            </option>
          ))}
        </select>

        <button type="button" onClick={mostrarRota}>Mostrar Rota</button>
      </form>

      <div id="resultados">
        <h2>Resultados</h2>
        <ul>
          {results.map((r, i) => (
            <li key={i}><strong>{r.name}</strong> - {r.prob}</li>
          ))}
        </ul>
      </div>

      <div id="mapa">
        {/* Aqui no futuro vamos integrar o Leaflet/Google Maps */}
      </div>
    </div>
  );
}
