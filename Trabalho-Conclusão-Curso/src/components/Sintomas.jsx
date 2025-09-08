import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sintomas() {
  const [sintomas, setSintomas] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const requireAuthAction = (callback) => {
    if (!user) {
      navigate("/cadastro");
    } else {
      callback();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    requireAuthAction(() => {
      console.log("Sintomas informados:", sintomas);
      // Futuramente enviaremos para o backend
    });
  };

  return (
    <form onSubmit={handleSubmit} className="fadeIn">
      <label>Digite seus sintomas:</label>
      <input
        type="text"
        value={sintomas}
        onChange={(e) => setSintomas(e.target.value)}
        placeholder="Ex: febre, náusea, dor de cabeça"
        required
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
