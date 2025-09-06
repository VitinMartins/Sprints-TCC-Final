import mongoose from "mongoose";

const PacienteSchema = new mongoose.Schema({
  nome: String,
  idade: Number,
  sexo: String,

  historicoClinico: {
    duracaoSintomasMeses: Number,
    frequenciaSintomas: { type: String, enum: ["constantes", "intermitentes", "em crises"] },
    historicoFamiliar: [String],
    usoMedicamentos: [String],
    sintomasPersistentes: [String],
  },

  exameFisico: {
    pressaoArterial: String,
    frequenciaCardiaca: Number,
    frequenciaRespiratoria: Number,
    temperaturaCorporal: Number,
    imc: Number,
    circunferenciaAbdominal: Number,
    limitacoesMotoras: Boolean,
  },

  impactoCotidiano: {
    interferenciaSono: Boolean,
    interferenciaTrabalho: Boolean,
    interferenciaAtividadesFisicas: Boolean,
    interferenciaSocial: Boolean,
    tempoInterferenciaMeses: Number,
  },

  examesLaboratoriais: {
    glicemiaJejum: Number,
    colesterolTotal: Number,
    triglicerideos: Number,
    hemograma: {
      hemoglobina: Number,
      leucocitos: Number,
      plaquetas: Number,
    },
    funcaoRenal: {
      ureia: Number,
      creatinina: Number,
    },
    funcaoHepatica: {
      tgo: Number,
      tgp: Number,
    },
  },

  fatoresRisco: {
    tabagismo: Boolean,
    etilismo: Boolean,
    sedentarismo: Boolean,
    alimentacaoRuim: Boolean,
    exposicaoOcupacional: [String],
    idadeAvancada: Boolean,
  }
});

export default mongoose.model("Paciente", PacienteSchema);

