const mensajesDaos = require("../../daos/mensajesDaos.js");
const { mensajesNormalize } = require("../normalizr/mensajesNormalize.js");

const mensajesContoller = new mensajesDaos();

const chatSocket = (io) => {
  io.on("connection", async (socket) => {
    io.sockets.emit(
      "mensajes",
      mensajesNormalize(await mensajesContoller.getAll({ sort: true }))
    );
    socket.on("nuevo-mensaje", async (msje) => {
      await mensajesContoller.save(JSON.parse(msje));
      io.sockets.emit(
        "mensajes",
        mensajesNormalize(await mensajesContoller.getAll({ sort: true }))
      );
    });
  });
};

module.exports = { chatSocket }