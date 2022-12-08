const { errorLogger } = require("../src/utils/logger");

const loginDaos = {

  get: (req, res) => {
    try {
      if (req.isAuthenticated()) {
        res.redirect("/home");
      } else {
        res.status(200).render("pages/login");
      }
    } catch (error) {
      errorLogger.error({
        URL: req.originalUrl,
        method: req.method,
        error: error.message,
      });
      return res
        .status(500).send({ status: "Log in Page Error (get)", body: error });
    }
  },

  postLogin: (req, res) => {
    try {
      const { username } = req.body;
      req.session.username = username;
      res.status(200).redirect("/home");
    } catch (error) {
      errorLogger.error({
        URL: req.originalUrl,
        method: req.method,
        error: error.message,
      });
      return res.status(500).send({ status: "Log In error", body: "error" });
    }
  },

	errorLogin: (req, res) => {
    try {
      res.render("pages/errorLogin");
    } catch (error) {
      res.status(500).send({ status: "Log In error", body: error });
    }
  },
};

module.exports = {loginDaos}