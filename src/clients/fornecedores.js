document.addEventListener('DOMContentLoaded', function () {
    // Função que carrega a lista de fornecedores ao entrar na página
    loadFornecedoresList();

    // Adiciona um listener do formulário para adicionar fornecedores
    document.getElementById('formAdicionarFornecedor').addEventListener('submit', function (event) {
        event.preventDefault();
        adicionarFornecedor();
    });
});

function adicionarFornecedor() {
    const id = document.getElementById('idFornecedor').value;
    const nome = document.getElementById('nomeFornecedor').value;
    const endereco = document.getElementById('enderecoFornecedor').value;
    const telefone = document.getElementById('telefoneFornecedor').value;

    fetch('http://localhost:3000/api/fornecedores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_fornecedor: id,
            nome_fornecedor: nome,
            endereco_fornecedor: endereco,
            telefone_fornecedor: telefone
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadFornecedoresList();
    })
    .catch(error => console.error("Erro:", error));
}

function loadFornecedoresList() {
    fetch('http://localhost:3000/api/fornecedores')
        .then(response => response.json())
        .then(data => displayFornecedoresList(data))
        .catch(error => console.error("Erro:", error));
}

function displayFornecedoresList(data) {
    const listaFornecedores = document.getElementById('listaFornecedores');
    listaFornecedores.innerHTML = '';

    data.forEach(fornecedor => {
        const listItem = document.createElement('li');
        listItem.textContent = `ID: ${fornecedor.id_fornecedor} - Nome: ${fornecedor.nome_fornecedor} - Endereço: ${fornecedor.endereco_fornecedor} - Telefone: ${fornecedor.telefone_fornecedor}`;

        // Adiciona links HATEOAS
        const links = document.createElement('ul');
        links.innerHTML = `
            <li><a href="${fornecedor._links.self.href}">Self</a></li>
            <li><a href="${fornecedor._links.update.href}">Update</a></li>
            <li><a href="${fornecedor._links.delete.href}">Delete</a></li>
        `;
        listItem.appendChild(links);

        listaFornecedores.appendChild(listItem);
    });
}
