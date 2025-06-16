const mongoose = require("mongoose");

const registroSchema = new mongoose.Schema({
  manual: {
    type: Number,
    default: null,
  },
  uber: {
    type: Number,
    default: null,
  },
  noveNove: {
    type: Number,
    default: null,
  },
  numero: {
    type: Number,
    required: true,
  },
  data: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true, // para createdAt e updatedAt
});

module.exports = mongoose.model("Registro", registroSchema);
