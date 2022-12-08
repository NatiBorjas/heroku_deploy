const { crearProductosApi } = require("../models/mockApi/index.js");
const { errorLogger } = require("../src/utils/logger");

const productosDaos = {
  getData: async (req, res) => {
    try {
      let productos = await crearProductosApi(5);
      if (productos.length > 0) {
        res.render("pages/products", {
          products: productos,
          productsExist: true,
        });
      } else {
        res.render("pages/products", {
          products: productos,
          productsExist: false,
        });
      }
    } catch (e) {
			errorLogger.error({
				error: error.message,
			});
      res.status(500).send({ error });
    }
  },
};

module.exports = {productosDaos}