const express = require("express");
const session = require("express-session");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const {chatSocket} = require("./src/utils/socketChat.js");
const { logger } = require("./src/utils/logger");

const {
	homeRouter, 
	productosRouter, 
	loginRouter, 
	logoutRouter,
	signupRouter,
	infoRouter,
	randomsRouter  
} = require("./routes/index.js");

// VARIABLES DE ENTORNO//
const { MONGOPSW, PORT, MODO } = require("./config.js");

// PASSPORT //
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const Usuarios = require("./models/usuariosSchema.js");
const { isValidPassword, createHash } = require("./src/utils/passwordsFunctions.js");

// CONFIGURACION APP
const compression = require("compression");
const app = express();
app.use(compression());
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONEXION BD MONGO //
mongoose
	.connect(`mongodb+srv://naty:${MONGOPSW}@ecommerce.nflhe41.mongodb.net/?retryWrites=true&w=majority`,
		{ useNewUrlParser: true })
	.then(console.log("Conectado a la BD Mongo"))
	.catch((err) => console.log(err));

// EJS PLANTILLA //
app.set("view engine", "ejs");
app.set("views", "./views");

// PASSPORT LOGIN//
passport.use(
  "login",
  new LocalStrategy((username, password, done) => {
    Usuarios.findOne({ username: username }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        console.log("No se encuentra el usuario " + username);
        return done(null, false);
      }
      if (!isValidPassword(user, password)) {
        console.log("Password invalida");
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

// PASSPORT  SIGNUP//
passport.use(
  "signup",
  new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      Usuarios.findOne({ username: username }, function (error, user) {
        if (error) {
          console.log("Error al registrarse: " + error);
          return done(error);
        }
        if (user) {
          console.log("Ese usuarix ya existe");
          return done(null, false);
        }
        const newUser = {
          username: username,
          password: createHash(password),
        };
        Usuarios.create(newUser, (err, user) => {
          if (err) {
            console.log("Error al guardar usuario: " + err);
            return done(err);
          }
          console.log("Registro existoso");
          return done(null, user);
        });
      });
    }
  )
);

// MONGODB SESSION
let MongoDBStore = require('connect-mongodb-session')(session);

app.use(
  session({
    store: new MongoDBStore({
			uri: `mongodb+srv://naty:${MONGOPSW}@ecommerce.nflhe41.mongodb.net/?retryWrites=true&w=majority`,
			collection: 'session' }),
    secret: "topsecret",
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 43200000,
    },
    rolling: true,
    resave: true,
    saveUninitialized: false,
  })
);

// MIDDLEWARES PASSPORT
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  Usuarios.findById(id, done);
});

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  req.session.touch();
  next();
});

app.use((req, res, next) => {
  logger.info({ URL: req.originalUrl, method: req.method });
  next();
});
// RUTAS
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.use("/api/products-test", productosRouter);
app.use("/login", loginRouter);
app.use("/registro", signupRouter);
app.use("/logout", logoutRouter);
app.use("/home", homeRouter);
app.use("/info", infoRouter);
app.use(randomsRouter);

app.all("*", (req, res) => {
	logger.warn({ URL: req.originalUrl, method: req.method });
  res.status(404).send("Ruta no encontrada");
});

// CLUSTER
const cluster = require("cluster");
const os = require("os");
const numCPUs = os.cpus().length;

if (MODO === "CLUSTER") {
  if (cluster.isPrimary) {
    console.log("MODO CLUSTER");
    console.log("Servidor Funcionando en Puerto: " + PORT);
    console.log(`Master PID ${process.pid} `);

    console.log(numCPUs);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
      cluster.fork();
      console.log(`Worker PID ${worker.process.pid} finalizado`);
    });
  } else {
    const httpServer = http.createServer(app);
    httpServer.listen(PORT, () => {
      console.log(`Worker PID ${process.pid} iniciado`);
    });
    const io = new Server(httpServer, {});
    chatSocket(io);
  }
} else {
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {});
  chatSocket(io);
  
  httpServer.listen(PORT, () => {
    console.log(`Servidor Funcionando en el puerto http://localhost:${PORT}`);
    console.log("MODO FORK");
  });
  httpServer.on("error", (error) => console.log(`Error en servidor ${error}`));
}
