import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Perfil({ user, setUser }) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({ nome: user.nome, email: user.email, senha: user.senha });
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório.";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Email inválido.";

    if (!formData.senha) newErrors.senha = "Senha é obrigatória.";
    else if (formData.senha.length < 6)
      newErrors.senha = "Senha deve ter pelo menos 6 caracteres.";

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
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Falha ao atualizar perfil.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir sua conta?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir conta");

      localStorage.removeItem("loggedInUser");
      setUser(null);
      alert("Conta excluída com sucesso!");
      navigate("/cadastro");
    } catch (error) {
      console.error(error);
      alert("Falha ao excluir conta.");
    }
  };

  return (
    <div className="form-container">
      <h1>Perfil do Usuário</h1>

      <div className="perfil-grid">
        <div className="perfil-field">
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
          />
          {errors.nome && <span className="error-text">{errors.nome}</span>}
        </div>

        <div className="perfil-field">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="perfil-field">
          <label>Senha:</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
          />
          {errors.senha && <span className="error-text">{errors.senha}</span>}
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        <button onClick={handleSave}>Salvar Alterações</button>
        <button
          onClick={handleDelete}
          style={{ backgroundColor: "#ef4444" }}
        >
          Excluir Conta
        </button>
      </div>
    </div>
  );
}
