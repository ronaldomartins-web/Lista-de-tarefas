let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function salvarLocalStorage() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function adicionarTarefa() {
    // Captura os valores digitados pelo usuário
    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const prioridade = document.getElementById("prioridade").value;
    // Validação: impede cadastro com campos vazios
    if (titulo === "" || descricao === "") {
        alert("Preencha todos os campos!");
        return;
    }

    const novaTarefa = {
        id: Date.now(),
        titulo,
        descricao,
        data: new Date().toLocaleDateString(),
        prioridade,
        status: "Pendente"
    };

    tarefas.push(novaTarefa);
    salvarLocalStorage();
    limparCampos();
    listarTarefas();
}

function limparCampos() {
    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
}

function listarTarefas(lista = tarefas) {
    const ul = document.getElementById("listaTarefas");
    const mensagem = document.getElementById("mensagem");

    ul.innerHTML = "";
    // Caso não existam tarefas, exibe mensagem
    if (lista.length === 0) {
        mensagem.textContent = "Não há tarefas cadastradas.";
        return;
    } else {
        mensagem.textContent = "";
    }

    lista.forEach(tarefa => {
        const li = document.createElement("li");

        let classePrioridade = "";
        if (tarefa.prioridade === "Baixa") classePrioridade = "baixa";
        if (tarefa.prioridade === "Média") classePrioridade = "media";
        if (tarefa.prioridade === "Alta") classePrioridade = "alta";

        li.classList.add(classePrioridade);

        if (tarefa.status === "Concluída") {
            li.classList.add("concluida");
        }

        li.innerHTML = `
            <strong>${tarefa.titulo}</strong><br>
            ${tarefa.descricao}<br>
            📅 ${tarefa.data} | ⚡ ${tarefa.prioridade} | ✔ ${tarefa.status}
            <div class="acoes">
                <button onclick="toggleStatus(${tarefa.id})">Concluir</button>
                <button onclick="editarTarefa(${tarefa.id})">Editar</button>
                <button onclick="excluirTarefa(${tarefa.id})">Excluir</button>
            </div>
        `;

        ul.appendChild(li);
    });
}
    // Percorre as tarefas e altera o status da tarefa clicada
function toggleStatus(id) {
    tarefas = tarefas.map(t => {
        if (t.id === id) {
            t.status = t.status === "Pendente" ? "Concluída" : "Pendente";
        }
        return t;
    });

    salvarLocalStorage();
    listarTarefas();
}

function excluirTarefa(id) {
    tarefas = tarefas.filter(t => t.id !== id);
    salvarLocalStorage();
    listarTarefas();
}

function editarTarefa(id) {
    const tarefa = tarefas.find(t => t.id === id);

    const novoTitulo = prompt("Novo título:", tarefa.titulo);
    const novaDescricao = prompt("Nova descrição:", tarefa.descricao);

    if (novoTitulo && novaDescricao) {
        tarefa.titulo = novoTitulo;
        tarefa.descricao = novaDescricao;

        salvarLocalStorage();
        listarTarefas();
    }
}

function buscarTarefa() {
    const termo = document.getElementById("pesquisa").value.toLowerCase();

    const filtradas = tarefas.filter(t =>
        t.titulo.toLowerCase().includes(termo)
    );

    listarTarefas(filtradas);
}

listarTarefas();