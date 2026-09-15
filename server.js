require("dotenv").config();

const path = require("path");
const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 3000;

// Middlewares por defecto (CORS, logger, static, bodyParser, etc.)
server.use(middlewares);

// Logger personalizado para ver peticiones en consola
server.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Rutas basadas en db.json
server.use(router);

server.listen(PORT, () => {
  console.log(`\n  ✔ API lista en  http://localhost:${PORT}`);
  console.log(`  ✔ Endpoints:    /tasks  /comments\n`);
});