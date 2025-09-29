import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Historico = () => {
  const { t } = useTranslation();
  const [historico, setHistorico] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user?._id) {
      setLoading(false);
      return;
    }

    const fetchHistorico = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/pacientes/perfil/${user._id}`
        );
        setHistorico(response.data);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, []);

  if (loading) return <p className="text-center mt-4">{t("carregandoHistorico")}</p>;
  if (!historico?.paciente)
    return <p className="text-center mt-4">{t("nenhumHistorico")}</p>;

  const paciente = historico.paciente;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">📜 {t("historicoUsuario")}</h2>

      {/* Card de Informações Pessoais */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          👤 {t("informacoesPessoaisEstiloVida")}
        </h3>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <p><strong>{t("idade")}:</strong> {paciente.idade}</p>
          <p><strong>{t("sexo")}:</strong> {paciente.sexo}</p>
          <p><strong>{t("altura")}:</strong> {paciente.altura} cm</p>
          <p><strong>{t("peso")}:</strong> {paciente.peso} kg</p>
          <p><strong>{t("historicoFamiliar")}:</strong> {paciente.historicoFamiliar?.join(", ")}</p>
          <p><strong>{t("atividadeFisica")}:</strong> {paciente.atividadeFisica}</p>
          <p><strong>{t("alimentacao")}:</strong> {paciente.alimentacao}</p>
          <p><strong>{t("alcool")}:</strong> {paciente.alcool}</p>
          <p><strong>{t("tabaco")}:</strong> {paciente.tabaco}</p>
          <p><strong>{t("sono")}:</strong> {paciente.sono}</p>
        </div>
      </div>

      {/* Card de Sintomas */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">🤒 {t("sintomasRegistrados")}</h3>
        {paciente.sintomas?.length > 0 ? (
          <ul className="space-y-3">
            {paciente.sintomas.map((s, i) => (
              <li
                key={i}
                className="p-4 border rounded-lg bg-gray-50 shadow-sm hover:bg-gray-100 transition"
              >
                <p><strong>{t("nome")}:</strong> {s.nome}</p>
                <p><strong>{t("duracao")}:</strong> {s.duracao}</p>
                <p><strong>{t("intensidade")}:</strong> {s.intensidade}</p>
              </li> 
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">{t("nenhumSintoma")}</p>
        )}
      </div>
    </div>
  );
};

export default Historico;