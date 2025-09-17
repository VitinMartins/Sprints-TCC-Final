import { useTranslation } from 'react-i18next';

const TrocaLinguagem = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(lang);
    } else {
      console.error("i18n não está configurado corretamente");
    }
  };

  return (
    <div className="language-switcher">
      <button onClick={() => changeLanguage('pt')} className={i18n.language === 'pt' ? 'active' : ''}>PT</button>
      <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'active' : ''}>EN</button>
      <button onClick={() => changeLanguage('es')} className={i18n.language === 'es' ? 'active' : ''}>ES</button>
    </div>
  );
};

export default TrocaLinguagem;
