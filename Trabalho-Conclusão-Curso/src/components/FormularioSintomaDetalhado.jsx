import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FormularioSintomasDetalhado = () => {
  const { t } = useTranslation();
  const [sintomas, setSintomas] = useState([{ nome: '', duracao: '', intensidade: '' }]);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const handleChange = (index, field, value) => {
    const novosSintomas = [...sintomas];
    novosSintomas[index][field] = value;
    setSintomas(novosSintomas);
  };

  const adicionarSintoma = () => setSintomas([...sintomas, { nome: '', duracao: '', intensidade: '' }]);
  const handlePrever = () => setAlert({ type: 'success', message: t('prever') });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user?._id) {
      setAlert({ type: 'error', message: t('usuarioNaoLogado') });
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/pacientes/sintomas", {
        userId: user._id,
        sintomas,
      });
      if (response.status === 200) {
        setAlert({ type: 'success', message: t('sucesso') });
        setTimeout(() => navigate("/historico"), 1500);
      } else {
        setAlert({ type: 'error', message: t('erro') });
      }
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: t('erro') });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{t('sintomas')}</h2>

      {alert.message && (
        <div className={alert.type === 'success' ? 'success-box' : 'error-box'}>
          {alert.message}
        </div>
      )}

      {sintomas.map((sintoma, index) => (
        <div key={index}>
          <label>{t('sintomas')}</label>
          <input
            type="text"
            value={sintoma.nome}
            onChange={(e) => handleChange(index, 'nome', e.target.value)}
            placeholder="Ex: dor de cabeça, febre..."
          />

          <label>{t('duracao')}</label>
          <input
            type="text"
            value={sintoma.duracao}
            onChange={(e) => handleChange(index, 'duracao', e.target.value)}
            placeholder="Ex: há 3 dias"
          />

          <label>{t('intensidade')}</label>
          <select value={sintoma.intensidade} onChange={(e) => handleChange(index, 'intensidade', e.target.value)}>
            <option value="">{t('intensidade')}</option>
            <option value="leve">{t('leve')}</option>
            <option value="moderada">{t('moderada')}</option>
            <option value="intensa">{t('intensa')}</option>
          </select>
        </div>
      ))}

      <button type="button" onClick={adicionarSintoma}>{t('adicionar')}</button>
      <button type="submit">{t('salvar')}</button>
      <button type="button" onClick={handlePrever}>{t('prever')}</button>
    </form>
  );
};

export default FormularioSintomasDetalhado;
