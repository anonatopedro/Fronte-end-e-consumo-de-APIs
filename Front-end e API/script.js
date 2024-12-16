document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#data-table tbody');

    // Recupera o valor de idCounter a partir do localStorage ou inicializa com 7
    let idCounter = localStorage.getItem('idCounter') ? parseInt(localStorage.getItem('idCounter')) : 1;
    let fetchIdCounter = idCounter; // Inicializa o contador com o valor de idCounter para manter a contagem correta

    // Recupera os nomes salvos no localStorage ou inicializa como array vazio
    let savedNames = JSON.parse(localStorage.getItem('names')) || [];

    // Função para adicionar uma linha na tabela
    function addRow(id, name) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${id}</td><td>${name}</td>`;
        tableBody.appendChild(row);
    }

    // Preenche a tabela com os nomes salvos no localStorage
    savedNames.forEach((name, index) => {
        addRow(index + 1, name); // Usando index + 1 para gerar o ID
        fetchIdCounter = Math.max(fetchIdCounter, index + 2); // Atualiza o fetchIdCounter se necessário
    });

    // 1. Requisição com fetch (3 primeiros usuários)
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(users => {
            console.log('Dados do fetch: ', users);
            users.slice(0, 3).forEach(user => {
                addRow(fetchIdCounter++, user.name); // Incrementa ID para cada usuário
            });
            // Atualiza o contador de IDs com o maior valor da tabela até o momento
            idCounter = Math.max(idCounter, fetchIdCounter);
            localStorage.setItem('idCounter', idCounter); // Atualiza o idCounter no localStorage
        })
        .catch(error => console.error('Erro com fetch:', error));

    // 2. Requisição com axios (3 próximos usuários)
    axios.get('https://jsonplaceholder.typicode.com/users')
        .then(response => {
            console.log('Dados do axios: ', response.data);
            response.data.slice(3, 6).forEach(user => {
                addRow(fetchIdCounter++, user.name); // Incrementa ID para cada usuário
            });
            // Atualiza o contador de IDs com o maior valor da tabela até o momento
            idCounter = Math.max(idCounter, fetchIdCounter);
            localStorage.setItem('idCounter', idCounter); // Atualiza o idCounter no localStorage
        })
        .catch(error => console.error('Erro com axios:', error));

    // 3. Adiciona nomes manualmente pelo formulário
    document.getElementById('userForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const nameInput = document.getElementById('name');
        const name = nameInput.value.trim();

        if (name) {
            addRow(idCounter, name); // Usa o idCounter para adicionar o nome com ID único
            savedNames.push(name); // Adiciona o nome ao array
            localStorage.setItem('names', JSON.stringify(savedNames)); // Salva no localStorage
            localStorage.setItem('idCounter', ++idCounter); // Atualiza o idCounter
            nameInput.value = ''; // Limpa o input
        }
    });
});
