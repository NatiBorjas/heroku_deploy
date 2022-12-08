const mongoose = require("mongoose");
const Messages = require("../models/mensajeSchema.js") ;
const { errorLogger } = require("../src/utils/logger");
const { MONGOPSW } = require("../config.js");

class mensajesDaos {
  constructor() {
    try {
      mongoose.connect(
        `mongodb+srv://naty:${MONGOPSW}@ecommerce.nflhe41.mongodb.net/?retryWrites=true&w=majority`,
        { useNewUrlParser: true }
      )
    } catch (e) {
      errorLogger.error({
        error: error.message,
      });
    }
  }

  async save(mensaje) {
    try {
      let timestamp = new Date();
      mensaje.timestamp = timestamp;
      await Messages.create(mensaje);
      return mensaje;
    } catch (error) {
			errorLogger.error({
        error: error.message,
      });
    }
  }

  async getAll(options) {
    try {
      let mensajes;
      if (options?.sort == true) {
        mensajes = await Messages.find({}).sort({ timestamp: -1 });
      } else {
        mensajes = await Messages.find({});
      }
      return mensajes;
    } catch (error) {
		errorLogger.error({
        error: error.message,
      });
    }
  }
}

module.exports = mensajesDaos