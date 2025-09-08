import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Email ou senha incorretos!");
        return;
      }

      localStorage.setItem("loggedInUser", JSON.stringify(data.user));
      if (setUser) setUser(data.user);

      navigate("/");
    } catch (error) {
      console.error("Erro no login:", error);
      setErrorMessage("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="form-container fadeIn">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        {errorMessage && <div className="error-box fadeIn">{errorMessage}</div>}

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
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
