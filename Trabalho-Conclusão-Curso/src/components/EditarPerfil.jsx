import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';

const EditarPerfil = () => {
  const [dados, setDados] = useState(null);
  const { t } = useTranslation();
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user?._id) return;

    const fetchPerfil = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pacientes/perfil/${user._id}`);
        setDados(response.data);
      } catch (error) {
        console.error(t('erroCarregarPerfil'), error);
      }
    };

    fetchPerfil();
  }, [t]);

  if (!dados) return <p>{t('carregando')}</p>;

  return (
    <div>
      <h2>{t('editarPerfil')}</h2>

      {/* Dados básicos do usuário */}
      <h3>{t('dadosUsuario')}</h3>
      <p><strong>{t('nome')}:</strong> {dados.nome}</p>
      <p><strong>{t('email')}:</strong> {dados.email}</p>

      {/* Informações pessoais e estilo de vida */}
      {dados.paciente && (
        <>
          <h3>{t('informacoesPessoais')} & {t('adicionais')}</h3>
          <p><strong>{t('idade')}:</strong> {dados.paciente.idade}</p>
          <p><strong>{t('sexo')}:</strong> {t(dados.paciente.sexo.toLowerCase())}</p>
          <p><strong>{t('altura')}:</strong> {dados.paciente.altura} cm</p>
          <p><strong>{t('peso')}:</strong> {dados.paciente.peso} kg</p>
          <p><strong>{t('historicoFamiliar')}:</strong> {dados.paciente.historicoFamiliar?.join(", ")}</p>
          <p><strong>{t('atividadeFisica')}:</strong> {dados.paciente.atividadeFisica}</p>
          <p><strong>{t('alimentacao')}:</strong> {dados.paciente.alimentacao}</p>
          <p><strong>{t('alcool')}:</strong> {dados.paciente.alcool}</p>
          <p><strong>{t('tabaco')}:</strong> {dados.paciente.tabaco}</p>
          <p><strong>{t('sono')}:</strong> {dados.paciente.sono}</p>

          {/* Sintomas */}
          <h3>{t('sintomas')}</h3>
          {dados.paciente.sintomas && dados.paciente.sintomas.length > 0 ? (
            <ul>
              {dados.paciente.sintomas.map((s, i) => (
                <li key={i}>
                  {s.nome} - {s.duracao} - {t('intensidade')}: {t(s.intensidade.toLowerCase())}
                </li>
              ))}
            </ul>
          ) : (
            <p>{t('nenhumRegistro')}</p>
          )}
        </>
      )}
    </div>
  );
};

export default EditarPerfil;
