// Paciente.js (Schema Mongoose)

import mongoose from 'mongoose';

const pacienteSchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// Alterados para Number para garantir cálculos corretos (ex: IMC)
idade: Number, 
sexo: String,
altura: Number, 
peso: Number, 
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