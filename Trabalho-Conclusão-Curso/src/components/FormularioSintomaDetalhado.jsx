// src/components/FormularioSintomasDetalhado.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MapaSection from './MapaSection'; // import do componente separado

const DOENCAS_CRONICAS = [
  { nome: 'Hipertensão', sintomas: ['dor de cabeça', 'tontura', 'visão turva'], idadeMin: 35 },
  { nome: 'Diabetes', sintomas: ['sede excessiva', 'urinar muito', 'fome constante'], idadeMin: 30 },
  { nome: 'Asma', sintomas: ['falta de ar', 'chiado no peito', 'tosse'], idadeMin: 0 },
  { nome: 'Cardiopatia', sintomas: ['cansaço', 'dor no peito', 'palpitação'], idadeMin: 40 },
];

const INTENSIDADE_PONTOS = {
  leve: 1,
  moderada: 2,
  intensa: 3,
};

const FormularioSintomasDetalhado = () => {
  const { t } = useTranslation();
  const [sintomas, setSintomas] = useState([{ nome: '', duracao: '', intensidade: '' }]);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [showMapa, setShowMapa] = useState(false);
  const [doencaPrevista, setDoencaPrevista] = useState(null);
  const navigate = useNavigate();

  const handleChange = (index, field, value) => {
    const novosSintomas = [...sintomas];
    novosSintomas[index][field] = value;
    setSintomas(novosSintomas);
  };

  const adicionarSintoma = () => setSintomas([...sintomas, { nome: '', duracao: '', intensidade: '' }]);

  const calcularDoenca = (paciente) => {
    const { idade, sintomas } = paciente;
    if (!sintomas || sintomas.length === 0) return null;

    const scores = DOENCAS_CRONICAS.map((d) => {
      let score = 0;
      d.sintomas.forEach((sintomaEsperado) => {
        sintomas.forEach((s) => {
          if (s.nome.toLowerCase().includes(sintomaEsperado.toLowerCase())) {
            score += INTENSIDADE_PONTOS[s.intensidade] || 1;
          }
        });
      });
      if (idade >= d.idadeMin) score += 1;
      return { doenca: d.nome, score };
    });

    scores.sort((a, b) => b.score - a.score);
    return scores[0].score > 0 ? scores[0].doenca : null;
  };

  const handlePrever = async () => {
    setAlert({ type: '', message: '' });
    setDoencaPrevista(null);

    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user?._id) {
      setAlert({ type: 'error', message: t('usuarioNaoLogado') });
      return;
    }

    try {
      // Buscar dados completos do paciente (informações + sintomas)
      const response = await axios.get(`http://localhost:5000/api/pacientes/perfil/${user._id}`);
      const paciente = response.data.paciente;

      if (!paciente) {
        setAlert({ type: 'error', message: 'Paciente sem dados salvos.' });
        return;
      }

      // Combina sintomas digitados + sintomas do banco (prioriza digitados)
      const sintomasCompletos = sintomas.filter(s => s.nome) ;
      if (sintomasCompletos.length === 0 && paciente.sintomas) {
        sintomasCompletos.push(...paciente.sintomas);
      }

      paciente.sintomas = sintomasCompletos;

      // Calcula doença mais provável
      const doenca = calcularDoenca(paciente);
      if (doenca) {
        setDoencaPrevista(doenca);
        setAlert({ type: 'success', message: `Doença mais provável: ${doenca}` });
      } else {
        setAlert({ type: 'info', message: 'Não foi possível prever uma doença com base nos sintomas.' });
      }

      // Exibe mapa somente depois da previsão
      setShowMapa(true);

    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: 'Erro ao buscar dados do paciente.' });
    }
  };

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
        setTimeout(() => 1500);
      } else {
        setAlert({ type: 'error', message: t('erro') });
      }
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: t('erro') });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-sintomas">
      <h2>{t('sintomas')}</h2>

      {alert.message && (
        <div className={alert.type === 'success' ? 'success-box' : alert.type === 'error' ? 'error-box' : 'info-box'}>
          {alert.message}
        </div>
      )}

      {sintomas.map((sintoma, index) => (
        <div key={index} className="sintoma-item">
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

      <div className="buttons">
        <button type="button" onClick={adicionarSintoma}>{t('adicionar')}</button>
        <button type="submit">{t('salvar')}</button>
        <button type="button" onClick={handlePrever}>{t('prever')}</button>
      </div>

      {showMapa && <MapaSection />}
    </form>
  );
};

export default FormularioSintomasDetalhado;
