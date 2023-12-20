const express = require('express');
const router = express.Router();
const fs = require('fs');

let dadosFornecedores = require('./data/dadosFornecedores.json');

// Endpoint para criar um novo fornecedor (Create do CRUD)
router.post('/fornecedores', (req, res) => {
    const novoFornecedor = req.body;

    if (!novoFornecedor.nome_fornecedor || !novoFornecedor.endereco_fornecedor || !novoFornecedor.telefone_fornecedor) {
        return res.status(400).json({ mensagem: "Dados incompletos, tente novamente" });
    }

    novoFornecedor.id_fornecedor = dadosFornecedores.fornecedores.length + 1;
    dadosFornecedores.fornecedores.push(novoFornecedor);
    salvarDados();

    // Adicionando links HATEOAS
    const fornecedorComLinks = {
        ...novoFornecedor,
        _links: {
            self: { href: `/api/fornecedores/${novoFornecedor.id_fornecedor}` },
            update: { href: `/api/fornecedores/${novoFornecedor.id_fornecedor}` },
            delete: { href: `/api/fornecedores/${novoFornecedor.id_fornecedor}` },
        },
    };

    return res.status(201).json({ mensagem: "Novo fornecedor cadastrado com sucesso!", fornecedor: fornecedorComLinks });
});

// Endpoint para obter todos os fornecedores (Read do CRUD)
router.get('/fornecedores', (req, res) => {
    const fornecedoresComLinks = dadosFornecedores.fornecedores.map(fornecedor => ({
        ...fornecedor,
        _links: {
            self: { href: `/api/fornecedores/${fornecedor.id_fornecedor}` },
            update: { href: `/api/fornecedores/${fornecedor.id_fornecedor}` },
            delete: { href: `/api/fornecedores/${fornecedor.id_fornecedor}` },
        },
    }));

    return res.json(fornecedoresComLinks);
});

// Endpoint para atualizar um fornecedor (Update do CRUD)
router.put('/fornecedores/:id', (req, res) => {
    const fornecedorId = parseInt(req.params.id);
    const atualizaFornecedor = req.body;
    const idFornecedor = dadosFornecedores.fornecedores.findIndex(f => f.id_fornecedor === fornecedorId);

    if (idFornecedor === -1) {
        return res.status(404).json({ mensagem: "Fornecedor não encontrado :/" });
    }

    // Atualiza as propriedades
    dadosFornecedores.fornecedores[idFornecedor].nome_fornecedor = atualizaFornecedor.nome_fornecedor || dadosFornecedores.fornecedores[idFornecedor].nome_fornecedor;
    dadosFornecedores.fornecedores[idFornecedor].endereco_fornecedor = atualizaFornecedor.endereco_fornecedor || dadosFornecedores.fornecedores[idFornecedor].endereco_fornecedor;
    dadosFornecedores.fornecedores[idFornecedor].telefone_fornecedor = atualizaFornecedor.telefone_fornecedor || dadosFornecedores.fornecedores[idFornecedor].telefone_fornecedor;

    salvarDados();

    // Adicionando links HATEOAS
    const fornecedorAtualizadoComLinks = {
        ...dadosFornecedores.fornecedores[idFornecedor],
        _links: {
            self: { href: `/api/fornecedores/${fornecedorId}` },
            update: { href: `/api/fornecedores/${fornecedorId}` },
            delete: { href: `/api/fornecedores/${fornecedorId}` },
        },
    };

    return res.json({ mensagem: "Fornecedor atualizado com sucesso!", fornecedor: fornecedorAtualizadoComLinks });
});

// Endpoint para excluir um fornecedor (Delete do CRUD)
router.delete('/fornecedores/:id', (req, res) => {
    const fornecedorId = parseInt(req.params.id);
    dadosFornecedores.fornecedores = dadosFornecedores.fornecedores.filter(f => f.id_fornecedor !== fornecedorId);
    salvarDados();
    return res.status(200).json({ mensagem: "Fornecedor excluído com sucesso" });
});

function salvarDados() {
    fs.writeFileSync(__dirname + '/data/dadosFornecedores.json', JSON.stringify(dadosFornecedores, null, 2));
}

module.exports = router;
