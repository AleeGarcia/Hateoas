document.addEventListener('DOMContentLoaded', function () {
    // Função que carrega a lista de vendas ao entrar na página
    loadVendasList();

    // Adiciona um listener do formulário para adicionar vendas
    document.getElementById('formAdicionarVenda').addEventListener('submit', function (event) {
        event.preventDefault();
        adicionarVenda();
    });
});

function adicionarVenda() {
    const idVenda = document.getElementById('idVenda').value;
    const dataVenda = document.getElementById('dataVenda').value;
    const idMedicamento = document.getElementById('idMedicamentoVenda').value;
    const idCliente = document.getElementById('idClienteVenda').value;

    fetch('http://localhost:3000/api/vendas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_venda: idVenda,
            data_venda: dataVenda,
            id_medicamento: idMedicamento,
            id_cliente: idCliente
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadVendasList();
    })
    .catch(error => console.error("Erro:", error));
}

function loadVendasList() {
    fetch('http://localhost:3000/api/vendas')
        .then(response => response.json())
        .then(data => displayVendasList(data))
        .catch(error => console.error("Erro:", error));
}

function displayVendasList(data) {
    const listaVendas = document.getElementById('listaVendas');
    listaVendas.innerHTML = '';

    data.forEach(venda => {
        const listItem = document.createElement('li');
        listItem.textContent = `ID Venda: ${venda.id_venda} - Data: ${venda.data_venda} - ID Medicamento: ${venda.id_medicamento} - ID Cliente: ${venda.id_cliente}`;

        // Adiciona links HATEOAS
        const links = document.createElement('ul');
        links.innerHTML = `
            <li><a href="${venda._links.self.href}">Self</a></li>
            <li><a href="${venda._links.update.href}">Update</a></li>
            <li><a href="${venda._links.delete.href}">Delete</a></li>
        `;
        listItem.appendChild(links);

        listaVendas.appendChild(listItem);
    });
}
