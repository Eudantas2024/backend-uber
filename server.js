const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Registro = require("./models/Registro");
const startDatabase = require("./config/database"); // importa a função de conexão

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Conecta ao banco antes de iniciar o servidor
startDatabase().then(() => {
  // Rotas API

  // POST: criar registro
  app.post("/api/registros", async (req, res) => {
    try {
      const { manual, uber, noveNove, data } = req.body;

      let numero = 0;

      if (manual !== undefined && manual !== null && manual !== "") {
        numero = Number(manual);
      } else {
        numero = (Number(uber) || 0) + (Number(noveNove) || 0);
      }

      if (!numero || isNaN(numero)) {
        return res.status(400).json({ erro: "Número inválido." });
      }

      // Definir a data:
      // Se 'data' existir e for uma string válida, usa ela convertida para Date,
      // caso contrário, usa data atual.
      let dataParaSalvar;
      if (data) {
        const dataConvertida = new Date(data);
        if (isNaN(dataConvertida)) {
          return res.status(400).json({ erro: "Data inválida." });
        }
        dataParaSalvar = dataConvertida;
      } else {
        dataParaSalvar = new Date();
      }

      const novoRegistro = new Registro({
        manual: manual || null,
        uber: uber || null,
        noveNove: noveNove || null,
        numero,
        data: dataParaSalvar,
      });

      const salvo = await novoRegistro.save();
      return res.status(201).json(salvo);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao criar registro." });
    }
  });


  // GET: listar todos registros
  app.get("/api/registros", async (req, res) => {
    try {
      const registros = await Registro.find().sort({ data: 1, createdAt: 1 });
      return res.json(registros);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao buscar registros." });
    }
  });

  // DELETE: excluir registro por ID
  app.delete("/api/registros/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const excluido = await Registro.findByIdAndDelete(id);
      if (!excluido) {
        return res.status(404).json({ erro: "Registro não encontrado." });
      }
      return res.json({ mensagem: "Registro excluído com sucesso." });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao excluir registro." });
    }
  });

// DELETE: excluir múltiplos registros pelo array de IDs enviado no body
app.delete("/api/registros", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ erro: "Lista de IDs inválida ou vazia." });
    }
    const resultado = await Registro.deleteMany({ _id: { $in: ids } });
    return res.json({ mensagem: `${resultado.deletedCount} registros excluídos.` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro ao excluir registros." });
  }
});


  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
}).catch((err) => {
  console.error("Erro ao iniciar servidor:", err);
  process.exit(1);
});
