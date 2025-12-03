// src/components/FormularioSintomasDetalhado.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MapaSection from './MapaSection';

// NOVO — Doenças com regras aprimoradas
const DOENCAS = [
  {
    nome: 'Hipertensão',
    especialidade: 'Cardiologia',
    sintomas: ['dor de cabeça', 'tontura', 'visão turva', 'cansaço'],
    idadeMin: 35,
    fatores: {
      historico: ['hipertensão', 'pressão alta'],
      imcMin: 27
    }
  },
  {
    nome: 'Diabetes',
    especialidade: 'Endocrinologia',
    sintomas: ['sede excessiva', 'urinar muito', 'fome constante', 'cansaço'],
    idadeMin: 30,
    fatores: {
      historico: ['diabetes', 'glicemia'],
      imcMin: 28
    }
  },
  {
    nome: 'Asma',
    especialidade: 'Pneumologia',
    sintomas: ['falta de ar', 'chiado no peito', 'tosse'],
    idadeMin: 0,
    fatores: {
      historico: ['asma', 'bronquite'],
      imcMin: 0
    }
  },
  {
    nome: 'Cardiopatia',
    especialidade: 'Cardiologia',
    sintomas: ['cansaço', 'dor no peito', 'palpitação', 'falta de ar'],
    idadeMin: 40,
    fatores: {
      historico: ['coração', 'cardiopatia'],
      imcMin: 26
    }
  }
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

  const adicionarSintoma = () =>
    setSintomas([...sintomas, { nome: '', duracao: '', intensidade: '' }]);

  // 🔥 NOVA FUNÇÃO — cálculo de risco avançado
  const calcularDoenca = (paciente) => {
    if (!paciente) return null;

    const { idade, altura, peso, historicoFamiliar, sintomas } = paciente;

    const imc = peso && altura ? peso / ((altura / 100) ** 2) : 0;

    const scores = DOENCAS.map((d) => {
      let score = 0;

      // 1) Sintomas compatíveis
      sintomas?.forEach((s) => {
        d.sintomas.forEach((esperado) => {
          if (s.nome.toLowerCase().includes(esperado)) {
            score += INTENSIDADE_PONTOS[s.intensidade] || 1;
          }
        });
      });

      // 2) Idade mínima
      if (idade >= d.idadeMin) score += 1;

      // 3) IMC elevado relacionado à doença
      if (imc >= d.fatores.imcMin && d.fatores.imcMin > 0) score += 1;

      // 4) Histórico familiar
      historicoFamiliar?.forEach((h) => {
        d.fatores.historico.forEach((match) => {
          if (h.toLowerCase().includes(match.toLowerCase())) score += 2;
        });
      });

      return {
        doenca: d.nome,
        especialidade: d.especialidade,
        score
      };
    });

    scores.sort((a, b) => b.score - a.score);
    return scores[0].score > 0 ? scores[0] : null;
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
      const response = await axios.get(
        `http://localhost:5000/api/pacientes/perfil/${user._id}`
      );

      const paciente = response.data.paciente;
      if (!paciente) {
        setAlert({ type: 'error', message: 'Paciente sem dados salvos.' });
        return;
      }

      // Mistura sintomas digitados com os existentes no banco
      const sintomasDigitados = sintomas.filter((s) => s.nome);
      paciente.sintomas =
        sintomasDigitados.length > 0 ? sintomasDigitados : paciente.sintomas;

      // 🔥 DETECÇÃO FINAL
      const resultado = calcularDoenca(paciente);

      if (resultado) {
        setDoencaPrevista(resultado);
        setAlert({
          type: 'success',
          message: `Possível doença: ${resultado.doenca} (Especialidade: ${resultado.especialidade})`
        });
      } else {
        setAlert({ type: 'info', message: 'Não foi possível prever uma doença.' });
      }

      setShowMapa(true);
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: 'Erro ao buscar dados do paciente.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!user?._id) {
      setAlert({ type: 'error', message: t('usuarioNaoLogado') });
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/pacientes/sintomas',
        {
          userId: user._id,
          sintomas
        }
      );

      if (response.status === 200) {
        setAlert({ type: 'success', message: t('sucesso') });
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
        <div
          className={
            alert.type === 'success'
              ? 'success-box'
              : alert.type === 'error'
              ? 'error-box'
              : 'info-box'
          }
        >
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
          <select
            value={sintoma.intensidade}
            onChange={(e) =>
              handleChange(index, 'intensidade', e.target.value)
            }
          >
            <option value="">{t('intensidade')}</option>
            <option value="leve">{t('leve')}</option>
            <option value="moderada">{t('moderada')}</option>
            <option value="intensa">{t('intensa')}</option>
          </select>
        </div>
      ))}

      <div className="buttons">
        <button type="button" onClick={adicionarSintoma}>
          {t('adicionar')}
        </button>
        <button type="submit">{t('salvar')}</button>
        <button type="button" onClick={handlePrever}>
          {t('prever')}
        </button>
      </div>

      {/* Agora o mapa recebe a doença prevista */}
      {showMapa && doencaPrevista && (
        <MapaSection doencaPrevista={doencaPrevista} />
      )}
    </form>
  );
};

export default FormularioSintomasDetalhado;
