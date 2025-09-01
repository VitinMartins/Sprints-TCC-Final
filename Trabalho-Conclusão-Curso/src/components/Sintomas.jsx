import { useState } from "react";

export default function Sintomas() {
  const [sintomas, setSintomas] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sintomas informados:", sintomas);
    // Futuramente enviaremos para o backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Digite seus sintomas:</label>
      <input
        type="text"
        value={sintomas}
        onChange={(e) => setSintomas(e.target.value)}
        placeholder="Ex: febre, náusea, dor de cabeça"
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
