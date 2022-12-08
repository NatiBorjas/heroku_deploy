const { errorLogger } = require("../src/utils/logger");

const registroDaos = {
  get: (req, res) => {
    try {
      if (req.isAuthenticated()) {
        res.redirect("/home");
      } else {
        res.status(200).render("pages/registro");
      }
    } catch (error) {
			errorLogger.error({
				error: error.message,
			});
      return res.status(500).send({ status: "Sign up Page Error (get)", body: error });
    }
  },
  postsignup: (req, res) => {
    try {
      const { username } = req.user;
      req.session.username = username;
			console.log(username)
      res.status(200).redirect("/home");
    } catch (error) {
			errorLogger.error({
				error: error.message,
			});
      return res.status(500).send({ status: "Error de registro", body: error });
    }
  },

  errorSignup: (req, res) => {
    try {
      res.render("pages/errorregistro");		
    } catch (error) {
			errorLogger.error({
        error: error.message,
      });
      res.status(500).send({ status: "Error de registro", body: error });
    }
  },
};

module.exports = {registroDaos}