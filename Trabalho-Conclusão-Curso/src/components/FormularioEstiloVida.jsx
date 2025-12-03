import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const FormularioEstiloVida = ({ userId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idade: '',
    sexo: '',
    altura: '',
    peso: '',
    historicoFamiliar: [],
    outroHistorico: '',
    atividadeFisica: '',
    alimentacao: '',
    alcool: '',
    tabaco: '',
    sono: ''
  });

  const [alert, setAlert] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        historicoFamiliar: checked
          ? [...prev.historicoFamiliar, value]
          : prev.historicoFamiliar.filter((item) => item !== value)
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/pacientes/estiloVida', { userId, ...formData });
      setAlert({ type: 'success', message: t('sucesso') });
      setTimeout(() => navigate('/sintomas'), 1500);
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: t('erro') });
    }
  };

  const calcularIMC = () => {
    const alturaMetros = parseFloat(formData.altura) / 100;
    const peso = parseFloat(formData.peso);
    if (!isNaN(alturaMetros) && !isNaN(peso) && alturaMetros > 0) {
      return (peso / (alturaMetros * alturaMetros)).toFixed(2);
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{t('informacoesPessoais')} & {t('adicionais')}</h2>

      {alert.message && (
        <div className={alert.type === 'success' ? 'success-box' : 'error-box'}>
          {alert.message}
        </div>
      )}

      <label>{t('idade')}</label>
      <input type="text" name="idade" value={formData.idade} onChange={handleChange} />

      <label>{t('sexo')}</label>
      <select name="sexo" value={formData.sexo} onChange={handleChange}>
        <option value="">{t('sexo')}</option>
        <option value="masculino">{t('masculino')}</option>
        <option value="feminino">{t('feminino')}</option>
      </select>

      <label>{t('altura')}</label>
      <input type="text" name="altura" value={formData.altura} onChange={handleChange} />

      <label>{t('peso')}</label>
      <input type="text" name="peso" value={formData.peso} onChange={handleChange} />
      {calcularIMC() && (<p><strong>IMC:</strong> {calcularIMC()}</p>)}

      <label>{t('historicoFamiliar')}</label>
      <div>
        {['Diabetes', 'Hipertensão', 'bronquite', 'Cardiopatias', 'pressão alta'].map((doenca) => (
          <label key={doenca}>
            <input
              type="checkbox"
              name="historicoFamiliar"
              value={doenca}
              checked={formData.historicoFamiliar.includes(doenca)}
              onChange={handleChange}
            />
            {doenca}
          </label>
        ))}

        <label>
          <input
            type="checkbox"
            name="historicoFamiliar"
            value="outro"
            checked={formData.historicoFamiliar.includes("outro")}
            onChange={handleChange}
          />
          {t('outro')}
        </label>

        {formData.historicoFamiliar.includes("outro") && (
          <input
            type="text"
            name="outroHistorico"
            value={formData.outroHistorico}
            onChange={handleChange}
            placeholder={t('outroHistorico')}
          />
        )}
      </div>

      <label>{t('atividadeFisica')}</label>
      <input type="text" name="atividadeFisica" value={formData.atividadeFisica} onChange={handleChange} />

      <label>{t('alimentacao')}</label>
      <select name="alimentacao" value={formData.alimentacao} onChange={handleChange}>
        <option value="">Selecione</option>
        <option value="equilibrada">Equilibrada</option>
        <option value="rica em gordura">Rica em gordura</option>
        <option value="rica em açúcar">Rica em açúcar</option>
        <option value="pobre em nutrientes">Pobre em nutrientes</option>
      </select>

      <label>{t('alcool')}</label>
      <select name="alcool" value={formData.alcool} onChange={handleChange}>
        <option value="">Selecione</option>
        <option value="não">Não</option>
        <option value="socialmente">Socialmente</option>
        <option value="frequentemente">Frequentemente</option>
      </select>

      <label>{t('tabaco')}</label>
      <select name="tabaco" value={formData.tabaco} onChange={handleChange}>
        <option value="">Selecione</option>
        <option value="não">Não</option>
        <option value="ocasionalmente">Ocasionalmente</option>
        <option value="frequentemente">Frequentemente</option>
      </select>

      <label>{t('sono')}</label>
      <select name="sono" value={formData.sono} onChange={handleChange}>
        <option value="">Selecione</option>
        <option value="boa">Boa</option>
        <option value="regular">Regular</option>
        <option value="ruim">Ruim</option>
      </select>

      <button type="submit">{t('salvar')}</button>
    </form>
  );
};

export default FormularioEstiloVida;