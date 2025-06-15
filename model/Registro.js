
const mongoose = require('mongoose');

const registroSchema = new mongoose.Schema({
  numero: { type: Number, required: true },
  data: { type: Date, required: true }
});

module.exports = mongoose.model('Registro', registroSchema);