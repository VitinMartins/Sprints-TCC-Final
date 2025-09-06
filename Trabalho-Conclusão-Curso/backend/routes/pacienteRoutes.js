import express from "express";
import Paciente from "../models/Paciente.js";

const router = express.Router();

// Criar novo paciente
router.post("/", async (req, res) => {
  try {
    const novoPaciente = new Paciente(req.body);
    const salvo = await novoPaciente.save();
    res.status(201).json(salvo);
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar paciente" });
  }
});

export default router;
