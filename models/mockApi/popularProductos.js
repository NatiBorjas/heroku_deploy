const { faker } = require("@faker-js/faker");

function crearProductosApi(n = 5) {
  let productos = [];
  for (let i = 0; i < n; i++) {
    productos.push({
      id: faker.database.mongodbObjectId(),
      name: faker.commerce.productName(),
      price: faker.commerce.price(10,1000,0,'$'),
      thumbnail: faker.image.avatar(),
    });
  }
  return productos;
}

module.exports = crearProductosApi;