const express = require('express');
const router = express.Router();
const fs = require('fs');

let dadosVendas = require('./data/dadosVendas.json');

// Endpoint para criar uma nova venda (Create do CRUD)
router.post('/vendas', (req, res) => {
    const novaVenda = req.body;

    if (!novaVenda.data_venda || !novaVenda.id_medicamento || !novaVenda.id_cliente) {
        return res.status(400).json({ mensagem: "Dados incompletos, tente novamente" });
    }

    novaVenda.id_venda = dadosVendas.vendas.length + 1;
    dadosVendas.vendas.push(novaVenda);
    salvarDadosVendas();

    // Adicionando links HATEOAS
    const vendaComLinks = {
        ...novaVenda,
        _links: {
            self: { href: `/api/vendas/${novaVenda.id_venda}` },
            update: { href: `/api/vendas/${novaVenda.id_venda}` },
            delete: { href: `/api/vendas/${novaVenda.id_venda}` },
        },
    };

    return res.status(201).json({ mensagem: "Nova venda cadastrada com sucesso!", venda: vendaComLinks });
});

// Endpoint para obter todas as vendas (Read do CRUD)
router.get('/vendas', (req, res) => {
    const vendasComLinks = dadosVendas.vendas.map(venda => ({
        ...venda,
        _links: {
            self: { href: `/api/vendas/${venda.id_venda}` },
            update: { href: `/api/vendas/${venda.id_venda}` },
            delete: { href: `/api/vendas/${venda.id_venda}` },
        },
    }));

    return res.json(vendasComLinks);
});

// Endpoint para atualizar uma venda (Update do CRUD)
router.put('/vendas/:id', (req, res) => {
    const vendaId = parseInt(req.params.id);
    const atualizaVenda = req.body;
    const idVenda = dadosVendas.vendas.findIndex(v => v.id_venda === vendaId);

    if (idVenda === -1) {
        return res.status(404).json({ mensagem: "Venda não encontrada :/" });
    }

    // Atualiza as propriedades
    dadosVendas.vendas[idVenda].data_venda = atualizaVenda.data_venda || dadosVendas.vendas[idVenda].data_venda;
    dadosVendas.vendas[idVenda].id_medicamento = atualizaVenda.id_medicamento || dadosVendas.vendas[idVenda].id_medicamento;
    dadosVendas.vendas[idVenda].id_cliente = atualizaVenda.id_cliente || dadosVendas.vendas[idVenda].id_cliente;

    salvarDadosVendas();

    // Adicionando links HATEOAS
    const vendaAtualizadaComLinks = {
        ...dadosVendas.vendas[idVenda],
        _links: {
            self: { href: `/api/vendas/${vendaId}` },
            update: { href: `/api/vendas/${vendaId}` },
            delete: { href: `/api/vendas/${vendaId}` },
        },
    };

    return res.json({ mensagem: "Venda atualizada com sucesso!", venda: vendaAtualizadaComLinks });
});

// Endpoint para excluir uma venda (Delete do CRUD)
router.delete('/vendas/:id', (req, res) => {
    const vendaId = parseInt(req.params.id);
    dadosVendas.vendas = dadosVendas.vendas.filter(v => v.id_venda !== vendaId);
    salvarDadosVendas();
    return res.status(200).json({ mensagem: "Venda excluída com sucesso" });
});

function salvarDadosVendas() {
    fs.writeFileSync(__dirname + '/data/dadosVendas.json', JSON.stringify(dadosVendas, null, 2));
}

module.exports = router;
