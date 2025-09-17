import mongoose from 'mongoose';

const pacienteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  idade: String,
  sexo: String,
  altura: String,
  peso: String,
  historicoFamiliar: [String],
  outroHistorico: String,
  atividadeFisica: String,
  alimentacao: String,
  alcool: String,
  tabaco: String,
  sono: String,
  sintomas: [
    {
      nome: String,
      duracao: String,
      intensidade: String
    }
  ]
}, { timestamps: true });

const Paciente = mongoose.model('Paciente', pacienteSchema);
export default Paciente;
