import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Cadastro
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Usuário já existe" });

    const newUser = new User({ nome, email, senha });
    await newUser.save();

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.senha !== senha) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    res.json({ message: "Login realizado com sucesso!", user });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// Atualizar usuário
router.put("/:id", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { nome, email, senha },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
});

export default router;