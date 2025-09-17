import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Cadastro() {
  const { t } = useTranslation();
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
        setErrorMessage(data.message || t("erroCadastro"));
        setSuccessMessage("");
        return;
      }

      setSuccessMessage(data.message || t("sucessoCadastro"));
      setErrorMessage("");
      setNome(""); setEmail(""); setSenha("");
      setTimeout(() => navigate("/login"), 1500); // Redireciona após 1.5s
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setErrorMessage(t("erroServidor"));
      setSuccessMessage("");
    }
  };

  return (
    <div className="form-container fadeIn">
      <h2>{t("cadastro")}</h2>
      <form onSubmit={handleCadastro}>
        {errorMessage && <div className="error-box fadeIn">{errorMessage}</div>}
        {successMessage && <div className="success-box fadeIn">{successMessage}</div>}

        <label>{t("nome")}:</label>
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        />
        <label>{t("email")}:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label>{t("senha")}:</label>
        <input
          type="password"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          required
        />
        <button type="submit">{t("cadastrar")}</button>
      </form>
    </div>
  );
}
