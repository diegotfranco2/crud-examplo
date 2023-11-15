import { produtos, addProduto, editProduto, removeProduto } from './data.js';


const inpPreco = document.querySelector('#inpPreco');
const inpUn = document.querySelector('#inpUn');
const inpQntd = document.querySelector('#inpQntd');
const inpNome = document.querySelector('#inpNome');

const botaoAdd = document.querySelector('#divInput').firstElementChild;
const botaoCancelar = document.querySelector('#btnCancelar');

// EVENTOS -------------------------------------------------

botaoAdd.addEventListener("click", () => abreModal());
botaoCancelar.addEventListener('click', () => fechaModal());

// EVENTOS -------------------------------------------------

carregaDados();

function limpaInputs() {
  inpPreco.value = '';
  inpUn.value = '';
  inpQntd.value = '';
  inpNome.value = '';
}

function abreModal(item) {
  const divBotoes = document.querySelector('#btnCancelar').parentElement;
  const tituloModal = document.querySelector('#modal').firstElementChild;

  console.log(item);
  if(item) {
    const tds = item.children;
    tituloModal.innerHTML = 'Editar um produto:';
    
    const botaoEditar = document.createElement('button');
    botaoEditar.id = 'btnEditar'
    botaoEditar.className = 'w-24 py-2 bg-green-600 text-white rounded-md hover:bg-green-700';
    botaoEditar.innerHTML = 'Editar';
    botaoEditar.addEventListener("click", () => editItem(item.getAttribute('data-key')));

    divBotoes.append(botaoEditar);
    
    inpNome.value = tds[0].innerHTML;
    inpQntd.value = tds[1].innerHTML;
    inpUn.value = tds[2].innerHTML;
    inpPreco.value = tds[3].innerHTML;
  }
  else{
    tituloModal.innerHTML = 'Adicionar novo produto:';

    const botaoSalvar = document.createElement('button');
    botaoSalvar.id = 'btnSalvar'
    botaoSalvar.className = 'w-24 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"';
    botaoSalvar.innerHTML = 'Salvar';
    botaoSalvar.addEventListener("click", () => addItem());
  
    divBotoes.append(botaoSalvar);
  }

  const modal = document.querySelector('#modal');
  modal.showModal();
}

function fechaModal() {
  const botaoSalvar = document.querySelector('#btnSalvar');
  const botaoEditar = document.querySelector('#btnEditar');
  
  if(botaoSalvar)
    botaoSalvar.remove();
  
  if(botaoEditar)
    botaoEditar.remove();

  modal.close();
  limpaInputs();
}

function carregaEventos() {
  const listaEdit = document.querySelectorAll('button[name="editBtn"]');
  listaEdit.forEach(item => {
    item.addEventListener('click', () => abreModal(item.parentElement.parentElement.parentElement));
  });

  const listaRemove = document.querySelectorAll('button[name="removeBtn"]');
  listaRemove.forEach(item => {
    item.addEventListener('click', () => removeItem(item.getAttribute('data-key')));
  });
}

function carregaDados() {
  const divTabela = document.querySelector('#divTabela');
  let tabela;

  tabela =
    `<table>
  <thead>
    <tr>
      <th>NOME</th>
      <th>QNTD</th>
      <th>UN</th>
      <th>PRECO</th>
      <th>AÇÕES</th>
    </tr>
  </thead>
  <tbody>`;

  produtos.forEach(linha => {
    const { id, ...rest } = linha;

    tabela += `<tr data-key="${id}">`;
    for (const key in rest) {
      tabela += `<td>${rest[key]}</td>`;
    }

    tabela +=
      `<td>
        <div class="flex justify-end gap-3">
          <button data-key="${id}" class="bg-amber-50 px-1 rounded-md hover:bg-amber-100" name="editBtn">
            <span class="material-symbols-outlined text-xl text-amber-400">edit</span>
          </button>
          <button data-key="${id}" class="bg-red-50 px-1 rounded-md hover:bg-red-100" name="removeBtn">
            <span class="material-symbols-outlined  text-xl text-red-400">delete</span>
          </button>
        </div>
      </td>`;
    tabela += '</tr>';
  });

  tabela += '</tbody></table>';
  divTabela.innerHTML = tabela;

  carregaEventos();
}

function addItem() {
  const item = {
    "id": 0,
    "nome": inpNome.value,
    "qntd": inpQntd.value,
    "un": inpUn.value,
    "preco": inpPreco.value
  }
  addProduto(item);
  carregaDados();
  fechaModal();
}

function editItem(id) {
  const novoItem = {
    "id": Number(id),
    "nome": inpNome.value,
    "qntd": inpQntd.value,
    "un": inpUn.value,
    "preco": inpPreco.value
  }
  editProduto(novoItem);
  carregaDados();
  fechaModal();
}

function removeItem(id) {
  removeProduto(Number(id));
  carregaDados();
}