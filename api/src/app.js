const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');

require('./db.js');

const server = express();

server.name = 'API';

// Middleware para manejar datos en formato JSON
server.use(bodyParser.json({ limit: '50mb' }));
// Middleware para manejar datos en formato de formulario
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
// Middleware para manejar cookies
server.use(cookieParser());
// Middleware para registrar solicitudes HTTP en la consola (morgan)
server.use(morgan('dev'));
// Middleware para configurar CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// Rutas de la aplicación
server.use('/', routes);

// Middleware para manejar errores
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
