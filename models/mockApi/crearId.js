const { faker } = require("@faker-js/faker");

async function crearId() {
  const id = faker.database.mongodbObjectId();

  return id;
}

module.exports = crearId;