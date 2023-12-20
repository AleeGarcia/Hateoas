document.addEventListener('DOMContentLoaded', function () {
    // Função que carrega a lista de clientes ao entrar na página
    loadClientesList();

    // Adiciona um listener do formulário para adicionar clientes
    document.getElementById('formAdicionarCliente').addEventListener('submit', function (event) {
        event.preventDefault();
        adicionarCliente();
    });
});

function adicionarCliente() {
    const id = document.getElementById('idCliente').value;
    const nome = document.getElementById('nomeCliente').value;
    const endereco = document.getElementById('enderecoCliente').value;
    const email = document.getElementById('emailCliente').value;
    const telefone = document.getElementById('telefoneCliente').value;

    fetch('http://localhost:3000/api/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            nome: nome,
            endereco: endereco,
            email: email,
            telefone: telefone
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadClientesList();
    })
    .catch(error => console.error("Erro:", error));
}

function loadClientesList() {
    fetch('http://localhost:3000/api/clientes')
        .then(response => response.json())
        .then(data => displayClientesList(data))
        .catch(error => console.error("Erro:", error));
}

function displayClientesList(data) {
    const listaClientes = document.getElementById('listaClientes');
    listaClientes.innerHTML = '';

    data.forEach(cliente => {
        const listItem = document.createElement('li');
        listItem.textContent = `ID: ${cliente.id} - Nome: ${cliente.nome} - Endereço: ${cliente.endereco} - Email: ${cliente.email} - Telefone: ${cliente.telefone}`;

        // Adiciona links HATEOAS
        const links = document.createElement('ul');
        links.innerHTML = `
            <li><a href="${cliente._links.self.href}">Self</a></li>
            <li><a href="${cliente._links.update.href}">Update</a></li>
            <li><a href="${cliente._links.delete.href}">Delete</a></li>
        `;
        listItem.appendChild(links);

        listaClientes.appendChild(listItem);
    });
}
