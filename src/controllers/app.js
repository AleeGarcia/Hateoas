const express = require('express');
const server = express();
const clientesRouter = require('./controllerClientes');
const medicamentosRouter = require('./controllerMedicamentos');
const fornecedoresRouter = require('./controllerFornecedores');
const vendasRouter = require('./controlllerVendas');
const cors = require('cors');

server.use(express.json());
server.use(cors());

// Middleware para adicionar links HATEOAS às respostas
server.use((req, res, next) => {
  res.hateoas = (links) => {
    res.json({ ...res.locals.data, _links: links });
  };
  next();
});

server.use('/api/clientes', clientesRouter);
server.use('/api/medicamentos', medicamentosRouter);
server.use('/api/fornecedores', fornecedoresRouter);
server.use('/api/vendas', vendasRouter);

server.listen(3000, () => {
  console.log('O servidor está funcionando! :D');
});
