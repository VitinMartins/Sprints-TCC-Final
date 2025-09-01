import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Rota from "./pages/Rota";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

function AppContent() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Checa usuário logado sempre que o App carregar
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedUser) {
      setUser(loggedUser);
    }
  }, []);

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <nav>
        <Link to="/">Home</Link> | <Link to="/rota">Rota</Link> |{" "}
        {!user ? (
          <>
            <Link to="/login">Login</Link> | <Link to="/cadastro">Cadastro</Link>
          </>
        ) : (
          <>
            <span>Bem-vindo, {user.nome}</span> |{" "}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rota" element={<Rota />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
