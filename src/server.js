const express = require('express');
const server = express();
const dados = require('./data/dados.json');
const fs = require('fs');

server.use(express.json());

server.listen(3000, () => {
    console.log('O servidor está funcionando! :D');
});

// Função para salvar dados no arquivo JSON
function salvarDados(dados) {
    fs.writeFileSync(__dirname + '/data/dados.json', JSON.stringify(dados, null, 2));
}

// Função para adicionar links HATEOAS
function adicionarLinks(resource, id, basePath) {
    resource.links = [
        { rel: 'self', method: 'GET', href: `${basePath}/${id}` },
        { rel: 'update', method: 'PUT', href: `${basePath}/${id}` },
        { rel: 'delete', method: 'DELETE', href: `${basePath}/${id}` },
    ];
}

// CRUD para Usuários
server.post('/usuarios', (req, res) => {
    const novoUsuario = req.body;

    if (!novoUsuario.id || !novoUsuario.nome || !novoUsuario.idade || !novoUsuario.curso) {
        return res.status(400).json({ mensagem: 'Dados incompletos, tente novamente' });
    }

    dados.users.push(novoUsuario);
    salvarDados(dados);

    // Adiciona links HATEOAS
    adicionarLinks(novoUsuario, novoUsuario.id, '/usuarios');

    return res.status(201).json({ mensagem: 'Novo usuário cadastrado com sucesso!', usuario: novoUsuario });
});

server.get('/usuarios', (req, res) => {
    const usuariosComLinks = dados.users.map(usuario => {
        // Adiciona links HATEOAS
        adicionarLinks(usuario, usuario.id, '/usuarios');
        return usuario;
    });

    return res.json(usuariosComLinks);
});

server.put('/usuarios/:id', (req, res) => {
    const usuarioId = parseInt(req.params.id);
    const atualizarUsuario = req.body;
    const idUsuario = dados.users.findIndex(u => u.id === usuarioId);

    if (idUsuario === -1) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado :/' });
    }

    dados.users[idUsuario].nome = atualizarUsuario.nome || dados.users[idUsuario].nome;
    dados.users[idUsuario].idade = atualizarUsuario.idade || dados.users[idUsuario].idade;
    dados.users[idUsuario].curso = atualizarUsuario.curso || dados.users[idUsuario].curso;

    salvarDados(dados);

    // Adiciona links HATEOAS
    adicionarLinks(dados.users[idUsuario], usuarioId, '/usuarios');

    return res.json({ mensagem: 'Usuário atualizado com sucesso!', usuario: dados.users[idUsuario] });
});

server.delete('/usuarios/:id', (req, res) => {
    const usuarioId = parseInt(req.params.id);
    dados.users = dados.users.filter(u => u.id !== usuarioId);
    salvarDados(dados);

    return res.status(200).json({ mensagem: 'Usuário excluído com sucesso' });
});

// CRUD para Medicamentos
server.post('/medicamentos', (req, res) => {
    const novoMedicamento = req.body;

    if (!novoMedicamento.id || !novoMedicamento.nome || !novoMedicamento.fabricante || !novoMedicamento.preco || !novoMedicamento.quantidade) {
        return res.status(400).json({ mensagem: 'Dados incompletos, tente novamente' });
    }

    dados.medicamentos.push(novoMedicamento);
    salvarDados(dados);

    // Adiciona links HATEOAS
    adicionarLinks(novoMedicamento, novoMedicamento.id, '/medicamentos');

    return res.status(201).json({ mensagem: 'Novo medicamento cadastrado com sucesso!', medicamento: novoMedicamento });
});

server.get('/medicamentos', (req, res) => {
    const medicamentosComLinks = dados.medicamentos.map(medicamento => {
        // Adiciona links HATEOAS
        adicionarLinks(medicamento, medicamento.id, '/medicamentos');
        return medicamento;
    });

    return res.json(medicamentosComLinks);
});

server.put('/medicamentos/:id', (req, res) => {
    const medicamentoId = parseInt(req.params.id);
    const atualizarMedicamento = req.body;
    const idMedicamento = dados.medicamentos.findIndex(m => m.id === medicamentoId);

    if (idMedicamento === -1) {
        return res.status(404).json({ mensagem: 'Medicamento não encontrado :/' });
    }

    dados.medicamentos[idMedicamento].nome = atualizarMedicamento.nome || dados.medicamentos[idMedicamento].nome;
    dados.medicamentos[idMedicamento].fabricante = atualizarMedicamento.fabricante || dados.medicamentos[idMedicamento].fabricante;
    dados.medicamentos[idMedicamento].preco = atualizarMedicamento.preco || dados.medicamentos[idMedicamento].preco;
    dados.medicamentos[idMedicamento].quantidade = atualizarMedicamento.quantidade || dados.medicamentos[idMedicamento].quantidade;

    salvarDados(dados);

    // Adiciona links HATEOAS
    adicionarLinks(dados.medicamentos[idMedicamento], medicamentoId, '/medicamentos');

    return res.json({ mensagem: 'Medicamento atualizado com sucesso!', medicamento: dados.medicamentos[idMedicamento] });
});

server.delete('/medicamentos/:id', (req, res) => {
    const medicamentoId = parseInt(req.params.id);
    dados.medicamentos = dados.medicamentos.filter(m => m.id !== medicamentoId);
    salvarDados(dados);

    return res.status(200).json({ mensagem: 'Medicamento excluído com sucesso' });
});

// CRUD para Fornecedores
server.post('/fornecedores', (req, res) => {
    const novoFornecedor = req.body;

    if (!novoFornecedor.id_fornecedor || !novoFornecedor.nome_fornecedor || !novoFornecedor.endereco_fornecedor || !novoFornecedor.telefone_fornecedor) {
        return res.status(400).json({ mensagem: 'Dados incompletos, tente novamente' });
    }

    dados.fornecedores.push(novoFornecedor);
    salvarDados(dados);

    // Adiciona links HATEOAS
    adicionarLinks(novoFornecedor, novoFornecedor.id_fornecedor, '/fornecedores');

    return res.status(201).json({ mensagem: 'Novo fornecedor cadastrado com sucesso!', fornecedor: novoFornecedor });
});

server.get('/fornecedores', (req, res) => {
    const fornecedoresComLinks = dados.fornecedores.map(fornecedor => {
        // Adiciona links HATEOAS
        adicionarLinks(fornecedor, fornecedor.id_fornecedor, '/fornecedores');
        return fornecedor;
    });

    return res.json(fornecedoresComLinks);
});

server.put('/fornecedores/:id', (req, res) => {
    const fornecedorId = parseInt(req.params.id);
    const atualizarFornecedor = req.body;
    const idFornecedor = dados.fornecedores.findIndex(f => f.id_fornecedor === fornecedorId);

    if (idFornecedor === -1) {
        return res.status(404).json({ mensagem: 'Fornecedor não encontrado :/' });
    }

    dados.fornecedores[idFornecedor].nome_fornecedor = atualizarFornecedor.nome_fornecedor || dados.fornecedores[idFornecedor].nome_fornecedor;
    dados.fornecedores[idFornecedor].endereco_fornecedor = atualizarFornecedor.endereco_fornecedor || dados.fornecedores[idFornecedor].endereco_fornecedor;
    dados.fornecedores[idFornecedor].telefone_fornecedor = atualizarFornecedor.telefone_fornecedor || dados.fornecedores[idFornecedor].telefone_fornecedor;

    salvarDados(dados);

    // Adiciona links HATEOAS
    adicionarLinks(dados.fornecedores[idFornecedor], fornecedorId, '/fornecedores');

    return res.json({ mensagem: 'Fornecedor atualizado com sucesso!', fornecedor: dados.fornecedores[idFornecedor] });
});

server.delete('/fornecedores/:id', (req, res) => {
    const fornecedorId = parseInt(req.params.id);
    dados.fornecedores = dados.fornecedores.filter(f => f.id_fornecedor !== fornecedorId);
    salvarDados(dados);

    return res.status(200).json({ mensagem: 'Fornecedor excluído com sucesso' });
});

// CRUD para Vendas
server.post('/vendas', (req, res) => {
    const novaVenda = req.body;

    if (!novaVenda.id_venda || !novaVenda.data_venda || !novaVenda.id_medicamento || !novaVenda.id_cliente) {
        return res.status(400).json({ mensagem: 'Dados incompletos, tente novamente' });
    }

    dados.vendas.push(novaVenda);
    salvarDados(dados);

    // Adiciona links HATEOAS
    adicionarLinks(novaVenda, novaVenda.id_venda, '/vendas');

    return res.status(201).json({ mensagem: 'Nova venda cadastrada com sucesso!', venda: novaVenda });
});

server.get('/vendas', (req, res) => {
    const vendasComLinks = dados.vendas.map(venda => {
        // Adiciona links HATEOAS
        adicionarLinks(venda, venda.id_venda, '/vendas');
        return venda;
    });

    return res.json(vendasComLinks);
});

server.put('/vendas/:id', (req, res) => {
    const vendaId = parseInt(req.params.id);
    const atualizarVenda = req.body;
    const idVenda = dados.vendas.findIndex(v => v.id_venda === vendaId);

    if (idVenda === -1) {
        return res.status(404).json({ mensagem: 'Venda não encontrada :/' });
    }

    dados.vendas[idVenda].data_venda = atualizarVenda.data_venda || dados.vendas[idVenda].data_venda;
    dados.vendas[idVenda].id_medicamento = atualizarVenda.id_medicamento || dados.vendas[idVenda].id_medicamento;
    dados.vendas[idVenda].id_cliente = atualizarVenda.id_cliente || dados.vendas[idVenda].id_cliente;

    salvarDados(dados);

    // Adiciona links HATEOAS
    adicionarLinks(dados.vendas[idVenda], vendaId, '/vendas');

    return res.json({ mensagem: 'Venda atualizada com sucesso!', venda: dados.vendas[idVenda] });
});

server.delete('/vendas/:id', (req, res) => {
    const vendaId = parseInt(req.params.id);
    dados.vendas = dados.vendas.filter(v => v.id_venda !== vendaId);
    salvarDados(dados);

    return res.status(200).json({ mensagem: 'Venda excluída com sucesso' });
});
