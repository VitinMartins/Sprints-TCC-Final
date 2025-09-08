import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Home from "./pages/Home";
import Rota from "./pages/Rota";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Perfil from "./pages/Perfil";

function AppContent() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedUser) setUser(loggedUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/login");
  };

  const userIsLogged = !!user;

  return (
    <>
      <nav className="navbar fadeIn">
        <Link to="/">Home</Link>
        <Link to="/rota">Rota</Link>

        {!userIsLogged ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/cadastro">Cadastro</Link>
          </>
        ) : (
          <div className="dropdown" ref={dropdownRef}>
            <button
              className="dropdown-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {user.nome} &#9662;
            </button>
            <div className={`dropdown-menu ${dropdownOpen ? "open" : ""}`}>
              <button
                onClick={() => {
                  navigate("/perfil");
                  setDropdownOpen(false);
                }}
              >
                Editar Perfil
              </button>
              <button className="delete-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rota" element={<Rota />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/perfil" element={userIsLogged ? <Perfil user={user} setUser={setUser} /> : <Cadastro />} />
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
