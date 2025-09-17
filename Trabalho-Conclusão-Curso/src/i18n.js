import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  pt: {
    translation: {
      // Geral
      salvar: "Salvar",
      sucesso: "Informações salvas com sucesso!",
      erro: "Erro ao salvar os dados.",
      carregando: "Carregando...",
      nenhumRegistro: "Nenhum registro encontrado.",

      // Formulário Estilo de Vida
      idade: "Idade",
      sexo: "Sexo",
      masculino: "Masculino",
      feminino: "Feminino",
      outro: "Outro",
      altura: "Altura (cm)",
      peso: "Peso (kg)",
      historicoFamiliar: "Histórico Familiar",
      outroHistorico: "Digite outra condição crônica",
      atividadeFisica: "Atividade Física (vezes por semana)",
      alimentacao: "Alimentação",
      alcool: "Consome álcool?",
      tabaco: "Fuma?",
      sono: "Qualidade do sono",
      adicionar: "Adicionar outro sintoma",
      sintomas: "Sintomas Atuais e Frequência",
      prever: "Prever",
      duracao: "Duração",
      intensidade: "Intensidade",
      leve: "Leve",
      moderada: "Moderada",
      intensa: "Intensa",
      usuarioNaoLogado: "Usuário não está logado.",

      // Cadastro / Login
      cadastro: "Cadastro",
      login: "Login",
      entrar: "Entrar",
      nome: "Nome",
      email: "Email",
      senha: "Senha",
      erroConexaoServidor: "Erro ao conectar com o servidor",
      erroCadastro: "Erro no cadastro!",
      cadastroSucesso: "Cadastro realizado com sucesso!",
      emailOuSenhaIncorretos: "Email ou senha incorretos!",

      // Perfil / Editar Perfil
      perfilUsuario: "Perfil do Usuário",
      salvarAlteracoes: "Salvar Alterações",
      excluirConta: "Excluir Conta",
      confirmExcluirConta: "Tem certeza que deseja excluir sua conta?",
      perfilAtualizado: "Perfil atualizado com sucesso!",
      falhaAtualizarPerfil: "Falha ao atualizar perfil.",
      contaExcluida: "Conta excluída com sucesso!",
      falhaExcluirConta: "Falha ao excluir conta.",
      nomeObrigatorio: "Nome é obrigatório.",
      emailObrigatorio: "Email é obrigatório.",
      emailInvalido: "Email inválido.",
      senhaObrigatoria: "Senha é obrigatória.",
      senhaMin6: "Senha deve ter pelo menos 6 caracteres.",
      erroCarregarDadosMedicos: "Não foi possível carregar os dados médicos.",

      // Histórico
      historicoUsuario: "Histórico do Usuário",
      informacoesPessoais: "Informações Pessoais e Estilo de Vida",
      sintomasRegistrados: "Sintomas Registrados",
      nenhumSintoma: "Nenhum sintoma informado."
    }
  },
  en: {
    translation: {
      // Geral
      salvar: "Save",
      sucesso: "Data saved successfully!",
      erro: "Error saving data.",
      carregando: "Loading...",
      nenhumRegistro: "No record found.",

      // Formulário Estilo de Vida
      idade: "Age",
      sexo: "Sex",
      masculino: "Male",
      feminino: "Female",
      outro: "Other",
      altura: "Height (cm)",
      peso: "Weight (kg)",
      historicoFamiliar: "Family History",
      outroHistorico: "Enter another chronic condition",
      atividadeFisica: "Physical Activity (times per week)",
      alimentacao: "Diet",
      alcool: "Do you drink alcohol?",
      tabaco: "Do you smoke?",
      sono: "Sleep Quality",
      adicionar: "Add another symptom",
      sintomas: "Current Symptoms and Frequency",
      prever: "Predict",
      duracao: "Duration",
      intensidade: "Intensity",
      leve: "Mild",
      moderada: "Moderate",
      intensa: "Severe",
      usuarioNaoLogado: "User is not logged in.",

      // Cadastro / Login
      cadastro: "Register",
      login: "Login",
      entrar: "Sign In",
      nome: "Name",
      email: "Email",
      senha: "Password",
      erroConexaoServidor: "Error connecting to server",
      erroCadastro: "Registration error!",
      cadastroSucesso: "Registration successful!",
      emailOuSenhaIncorretos: "Incorrect email or password!",

      // Perfil / Editar Perfil
      perfilUsuario: "User Profile",
      salvarAlteracoes: "Save Changes",
      excluirConta: "Delete Account",
      confirmExcluirConta: "Are you sure you want to delete your account?",
      perfilAtualizado: "Profile updated successfully!",
      falhaAtualizarPerfil: "Failed to update profile.",
      contaExcluida: "Account deleted successfully!",
      falhaExcluirConta: "Failed to delete account.",
      nomeObrigatorio: "Name is required.",
      emailObrigatorio: "Email is required.",
      emailInvalido: "Invalid email.",
      senhaObrigatoria: "Password is required.",
      senhaMin6: "Password must be at least 6 characters.",
      erroCarregarDadosMedicos: "Unable to load medical data.",

      // Histórico
      historicoUsuario: "User History",
      informacoesPessoais: "Personal Information & Lifestyle",
      sintomasRegistrados: "Registered Symptoms",
      nenhumSintoma: "No symptoms reported."
    }
  },
  es: {
    translation: {
      // Geral
      salvar: "Guardar",
      sucesso: "¡Datos guardados correctamente!",
      erro: "Error al guardar los datos.",
      carregando: "Cargando...",
      nenhumRegistro: "No se encontró ningún registro.",

      // Formulário Estilo de Vida
      idade: "Edad",
      sexo: "Sexo",
      masculino: "Masculino",
      feminino: "Femenino",
      outro: "Otro",
      altura: "Altura (cm)",
      peso: "Peso (kg)",
      historicoFamiliar: "Historial Familiar",
      outroHistorico: "Ingrese otra condición crónica",
      atividadeFisica: "Actividad Física (veces por semana)",
      alimentacao: "Alimentación",
      alcool: "¿Consume alcohol?",
      tabaco: "¿Fuma?",
      sono: "Calidad del sueño",
      adicionar: "Agregar otro síntoma",
      sintomas: "Síntomas actuales y frecuencia",
      prever: "Predecir",
      duracao: "Duración",
      intensidade: "Intensidad",
      leve: "Leve",
      moderada: "Moderada",
      intensa: "Intensa",
      usuarioNaoLogado: "El usuario no ha iniciado sesión.",

      // Cadastro / Login
      cadastro: "Registro",
      login: "Iniciar Sesión",
      entrar: "Entrar",
      nome: "Nombre",
      email: "Correo electrónico",
      senha: "Contraseña",
      erroConexaoServidor: "Error al conectar con el servidor",
      erroCadastro: "Error en el registro!",
      cadastroSucesso: "¡Registro realizado con éxito!",
      emailOuSenhaIncorretos: "¡Correo o contraseña incorrectos!",

      // Perfil / Editar Perfil
      perfilUsuario: "Perfil del Usuario",
      salvarAlteracoes: "Guardar cambios",
      excluirConta: "Eliminar cuenta",
      confirmExcluirConta: "¿Está seguro de que desea eliminar su cuenta?",
      perfilAtualizado: "¡Perfil actualizado correctamente!",
      falhaAtualizarPerfil: "Error al actualizar perfil.",
      contaExcluida: "¡Cuenta eliminada correctamente!",
      falhaExcluirConta: "Error al eliminar cuenta.",
      nomeObrigatorio: "El nombre es obligatorio.",
      emailObrigatorio: "El correo electrónico es obligatorio.",
      emailInvalido: "Correo electrónico inválido.",
      senhaObrigatoria: "La contraseña es obligatoria.",
      senhaMin6: "La contraseña debe tener al menos 6 caracteres.",
      erroCarregarDadosMedicos: "No se pudieron cargar los datos médicos.",

      // Histórico
      historicoUsuario: "Historial del Usuario",
      informacoesPessoais: "Información Personal y Estilo de Vida",
      sintomasRegistrados: "Síntomas Registrados",
      nenhumSintoma: "No se reportaron síntomas."
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "pt",
    interpolation: { escapeValue: false },
  });

export default i18n;
