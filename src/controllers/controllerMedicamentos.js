const express = require('express');
const router = express.Router();
const fs = require('fs');

let dadosMedicamentos = require('./data/dadosMedicamentos.json');

// Endpoint para criar um novo medicamento (Create do CRUD)
router.post('/medicamentos', (req, res) => {
    const novoMedicamento = req.body;

    if (!novoMedicamento.nome || !novoMedicamento.fabricante || !novoMedicamento.preco || !novoMedicamento.quantidade) {
        return res.status(400).json({ mensagem: "Dados incompletos, tente novamente" });
    }

    novoMedicamento.id = dadosMedicamentos.medicamentos.length + 1;
    dadosMedicamentos.medicamentos.push(novoMedicamento);
    salvarDados();

    // Adicionando links HATEOAS
    const medicamentoComLinks = {
        ...novoMedicamento,
        _links: {
            self: { href: `/api/medicamentos/${novoMedicamento.id}` },
            update: { href: `/api/medicamentos/${novoMedicamento.id}` },
            delete: { href: `/api/medicamentos/${novoMedicamento.id}` },
        },
    };

    return res.status(201).json({ mensagem: "Novo medicamento cadastrado com sucesso!", medicamento: medicamentoComLinks });
});

// Endpoint para obter todos os medicamentos (Read do CRUD)
router.get('/medicamentos', (req, res) => {
    const medicamentosComLinks = dadosMedicamentos.medicamentos.map(medicamento => ({
        ...medicamento,
        _links: {
            self: { href: `/api/medicamentos/${medicamento.id}` },
            update: { href: `/api/medicamentos/${medicamento.id}` },
            delete: { href: `/api/medicamentos/${medicamento.id}` },
        },
    }));

    return res.json(medicamentosComLinks);
});

// Endpoint para atualizar um medicamento (Update do CRUD)
router.put('/medicamentos/:id', (req, res) => {
    const medicamentoId = parseInt(req.params.id);
    const atualizaMedicamento = req.body;
    const idMedicamento = dadosMedicamentos.medicamentos.findIndex(m => m.id === medicamentoId);

    if (idMedicamento === -1) {
        return res.status(404).json({ mensagem: "Medicamento não encontrado :/" });
    }

    // Atualiza as propriedades
    dadosMedicamentos.medicamentos[idMedicamento].nome = atualizaMedicamento.nome || dadosMedicamentos.medicamentos[idMedicamento].nome;
    dadosMedicamentos.medicamentos[idMedicamento].fabricante = atualizaMedicamento.fabricante || dadosMedicamentos.medicamentos[idMedicamento].fabricante;
    dadosMedicamentos.medicamentos[idMedicamento].preco = atualizaMedicamento.preco || dadosMedicamentos.medicamentos[idMedicamento].preco;
    dadosMedicamentos.medicamentos[idMedicamento].quantidade = atualizaMedicamento.quantidade || dadosMedicamentos.medicamentos[idMedicamento].quantidade;

    salvarDados();

    // Adicionando links HATEOAS
    const medicamentoAtualizadoComLinks = {
        ...dadosMedicamentos.medicamentos[idMedicamento],
        _links: {
            self: { href: `/api/medicamentos/${medicamentoId}` },
            update: { href: `/api/medicamentos/${medicamentoId}` },
            delete: { href: `/api/medicamentos/${medicamentoId}` },
        },
    };

    return res.json({ mensagem: "Medicamento atualizado com sucesso!", medicamento: medicamentoAtualizadoComLinks });
});

// Endpoint para excluir um medicamento (Delete do CRUD)
router.delete('/medicamentos/:id', (req, res) => {
    const medicamentoId = parseInt(req.params.id);
    dadosMedicamentos.medicamentos = dadosMedicamentos.medicamentos.filter(m => m.id !== medicamentoId);
    salvarDados();
    return res.status(200).json({ mensagem: "Medicamento excluído com sucesso" });
});

function salvarDados() {
    fs.writeFileSync(__dirname + '/data/dadosMedicamentos.json', JSON.stringify(dadosMedicamentos, null, 2));
}

module.exports = router;
