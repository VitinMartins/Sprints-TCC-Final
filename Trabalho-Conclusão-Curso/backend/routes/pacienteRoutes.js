import express from 'express';
import Paciente from '../models/Paciente.js';
import User from '../models/User.js';

const router = express.Router();

// Salvar informações pessoais e estilo de vida
router.post('/estiloVida', async (req, res) => {
  try {
    const { userId, ...dados } = req.body;
    const pacienteExistente = await Paciente.findOne({ userId });

    if (pacienteExistente) {
      await Paciente.updateOne({ userId }, { $set: dados });
      return res.status(200).json({ message: 'Dados atualizados com sucesso.' });
    }

    const novoPaciente = new Paciente({ userId, ...dados });
    await novoPaciente.save();
    res.status(201).json({ message: 'Dados salvos com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar dados.' });
  }
});

// Salvar sintomas
router.post('/sintomas', async (req, res) => {
  try {
    const { userId, sintomas } = req.body;
    const paciente = await Paciente.findOne({ userId });

    if (!paciente) return res.status(404).json({ error: 'Paciente não encontrado.' });

    paciente.sintomas = sintomas;
    await paciente.save();

    res.status(200).json({ message: 'Sintomas salvos com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar sintomas.' });
  }
});

// Buscar dados do paciente
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const paciente = await Paciente.findOne({ userId });

    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado.' });
    }

    res.status(200).json(paciente);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados do paciente.' });
  }
});

// Novo endpoint: Perfil completo
router.get('/perfil/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password"); // remove senha
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const paciente = await Paciente.findOne({ userId });

    res.status(200).json({
      ...user.toObject(),
      paciente
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar perfil completo." });
  }
});

export default router;
