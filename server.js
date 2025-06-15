require("dotenv").config();
const express = require("express");
const startDatabase = require("./config/database");
const Registro = require("./models/Registro");
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());


// Iniciar conexão com o banco
startDatabase();

// Rota para salvar número e data
app.post("/api/registros", async (req, res) => {
  const { numero, data } = req.body;

  if (numero === undefined || numero === null || isNaN(numero)) {
    return res.status(400).json({ erro: "Número é obrigatório e deve ser um número válido." });
  }

  try {
    const novoRegistro = new Registro({
      numero,
      data: data ? new Date(data) : new Date()
    });

    await novoRegistro.save();
    res.status(201).json({ mensagem: "Registro salvo com sucesso!", registro: novoRegistro });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao salvar registro." });
  }
});


// Rota para listar todos os registros
app.get("/api/registros", async (req, res) => {
  try {
    const registros = await Registro.find().sort({ data: -1 }); // ordena por data decrescente
    res.status(200).json(registros);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar registros." });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
