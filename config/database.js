const mongoose = require("mongoose");
require("dotenv").config();

async function startDatabase() {
    const { DB_USER, DB_PASS, DB_NAME } = process.env;
    const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@teste25.k3mb7nq.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=teste25`;

    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Conectado ao MongoDB Atlas");
    } catch (error) {
        console.error("❌ Erro ao conectar ao MongoDB:", error.message);
        process.exit(1);
    }
}

module.exports = startDatabase;

