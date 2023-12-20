const express = require('express');
const router = express.Router();
const fs = require('fs');

let dadosClientes = require('../data/dadosClientes.json');

// Endpoint para criar um novo cliente (Create do CRUD)
router.post('/clientes', (req, res) => {
  const novoCliente = req.body;

  if (!novoCliente.nome || !novoCliente.endereco || !novoCliente.email || !novoCliente.telefone) {
    return res.status(400).json({ mensagem: 'Dados incompletos, tente novamente' });
  }

  novoCliente.id = dadosClientes.Cliente.length + 1;
  dadosClientes.Cliente.push(novoCliente);
  salvarDados();

  // Adicionando links HATEOAS
  const clienteComLinks = {
    ...novoCliente,
    _links: {
      self: { href: `/api/clientes/${novoCliente.id}` },
      update: { href: `/api/clientes/${novoCliente.id}` },
      delete: { href: `/api/clientes/${novoCliente.id}` },
    },
  };

  return res.status(201).json(clienteComLinks);
});

// Endpoint para obter todos os clientes (Read do CRUD)
router.get('/clientes', (req, res) => {
  const clientesComLinks = dadosClientes.Cliente.map(cliente => ({
    ...cliente,
    _links: {
      self: { href: `/api/clientes/${cliente.id}` },
      update: { href: `/api/clientes/${cliente.id}` },
      delete: { href: `/api/clientes/${cliente.id}` },
    },
  }));

  return res.json(clientesComLinks);
});

// Endpoint para atualizar um cliente (Update do CRUD)
router.put('/clientes/:id', (req, res) => {
  const clienteId = parseInt(req.params.id);
  const atualizaCliente = req.body;

  const idCliente = dadosClientes.Cliente.findIndex(cliente => cliente.id === clienteId);

  if (idCliente === -1) {
    return res.status(404).json({ mensagem: 'Cliente não encontrado :/' });
  }

  // Atualiza as propriedades
  dadosClientes.Cliente[idCliente].nome = atualizaCliente.nome || dadosClientes.Cliente[idCliente].nome;
  dadosClientes.Cliente[idCliente].endereco = atualizaCliente.endereco || dadosClientes.Cliente[idCliente].endereco;
  dadosClientes.Cliente[idCliente].email = atualizaCliente.email || dadosClientes.Cliente[idCliente].email;
  dadosClientes.Cliente[idCliente].telefone = atualizaCliente.telefone || dadosClientes.Cliente[idCliente].telefone;

  salvarDados();

  // Adicionando links HATEOAS
  const clienteAtualizadoComLinks = {
    ...dadosClientes.Cliente[idCliente],
    _links: {
      self: { href: `/api/clientes/${clienteId}` },
      update: { href: `/api/clientes/${clienteId}` },
      delete: { href: `/api/clientes/${clienteId}` },
    },
  };

  return res.json({ mensagem: 'Cliente atualizado com sucesso!', cliente: clienteAtualizadoComLinks });
});

// Endpoint para excluir um cliente (Delete do CRUD)
router.delete('/clientes/:id', (req, res) => {
  const clienteId = parseInt(req.params.id);

  dadosClientes.Cliente = dadosClientes.Cliente.filter(cliente => cliente.id !== clienteId);
  salvarDados();

  return res.status(200).json({ mensagem: 'Cliente excluído com sucesso' });
});

function salvarDados() {
  fs.writeFileSync(__dirname + '/../data/dadosClientes.json', JSON.stringify(dadosClientes, null, 2));
}

module.exports = router;
