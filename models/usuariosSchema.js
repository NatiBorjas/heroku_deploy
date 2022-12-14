const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
  },

  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Usuarios", UsuarioSchema);