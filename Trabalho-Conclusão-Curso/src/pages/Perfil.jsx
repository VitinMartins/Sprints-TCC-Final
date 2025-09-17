import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function Perfil({ user, setUser }) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const [dadosPaciente, setDadosPaciente] = useState(null);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({ nome: user.nome, email: user.email, senha: user.senha });
      buscarDadosPaciente(user._id);
    }
  }, [user]);

  const buscarDadosPaciente = async (userId) => {
    try {
      const res = await axios.get(`/api/paciente/${userId}`);
      setDadosPaciente(res.data);
    } catch (err) {
      console.error(err);
      setErrorMessage(t("erroCarregarDadosMedicos"));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = t("nomeObrigatorio");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = t("emailObrigatorio");
    else if (!emailRegex.test(formData.email)) newErrors.email = t("emailInvalido");

    if (!formData.senha) newErrors.senha = t("senhaObrigatoria");
    else if (formData.senha.length < 6) newErrors.senha = t("senhaMin6");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erro ao atualizar perfil");

      const updatedUser = await response.json();
      setUser(updatedUser);
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      setSuccessMessage(t("perfilAtualizado"));
      setErrorMessage("");
    } catch (error) {
      console.error(error);
      setErrorMessage(t("falhaAtualizarPerfil"));
      setSuccessMessage("");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(t("confirmExcluirConta"))) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir conta");

      localStorage.removeItem("loggedInUser");
      setUser(null);
      setSuccessMessage(t("contaExcluida"));
      setErrorMessage("");
      setTimeout(() => navigate("/cadastro"), 1500);
    } catch (error) {
      console.error(error);
      setErrorMessage(t("falhaExcluirConta"));
      setSuccessMessage("");
    }
  };

  const calcularIMC = () => {
    const alturaMetros = parseFloat(dadosPaciente?.altura) / 100;
    const peso = parseFloat(dadosPaciente?.peso);
    if (!isNaN(alturaMetros) && !isNaN(peso) && alturaMetros > 0) {
      const imc = peso / (alturaMetros * alturaMetros);
      return imc.toFixed(2);
    }
    return null;
  };

  return (
    <div className="form-container fadeIn">
      <h1>{t("perfilUsuario")}</h1>

      {errorMessage && <div className="error-box fadeIn">{errorMessage}</div>}
      {successMessage && <div className="success-box fadeIn">{successMessage}</div>}

      <div className="perfil-grid">
        <div className="perfil-field">
          <label>{t("nome")}:</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} />
          {errors.nome && <span className="error-text">{errors.nome}</span>}
        </div>

        <div className="perfil-field">
          <label>{t("email")}:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="perfil-field">
          <label>{t("senha")}:</label>
          <input type="password" name="senha" value={formData.senha} onChange={handleChange} />
          {errors.senha && <span className="error-text">{errors.senha}</span>}
        </div>
      </div>

      <div className="btn-group">
        <button onClick={handleSave}>{t("salvarAlteracoes")}</button>
        <button className="delete-btn" onClick={handleDelete}>
          {t("excluirConta")}
        </button>
      </div>
    </div>
  );
}
