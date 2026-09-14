/**
 * Arranca json-server leyendo la configuración del archivo .env
 * Uso: npm run api
 */
require("dotenv").config();

const cors = require('cors');
app.use(cors());

const path = require("path");
const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 3000;

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Logger para ver las peticiones en consola
server.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

server.use(router);

server.listen(PORT, () => {
  console.log(`\n  ✔ API lista en  http://localhost:${PORT}`);
  console.log(`  ✔ Endpoints:    /tasks  /comments\n`);
});