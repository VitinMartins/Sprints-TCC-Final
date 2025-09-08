import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleCadastro = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Erro no cadastro!");
        setSuccessMessage("");
        return;
      }

      setSuccessMessage(data.message || "Cadastro realizado com sucesso!");
      setErrorMessage("");
      setNome(""); setEmail(""); setSenha("");
      setTimeout(() => navigate("/login"), 1500); // Redireciona após 1.5s
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setErrorMessage("Erro ao conectar com o servidor");
      setSuccessMessage("");
    }
  };

  return (
    <div className="form-container fadeIn">
      <h2>Cadastro</h2>
      <form onSubmit={handleCadastro}>
        {errorMessage && <div className="error-box fadeIn">{errorMessage}</div>}
        {successMessage && <div className="success-box fadeIn">{successMessage}</div>}

        <label>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label>Senha:</label>
        <input
          type="password"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
