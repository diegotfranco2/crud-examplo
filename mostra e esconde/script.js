import { produtos, addProduto, editProduto, removeProduto } from './data.js';


const inpPreco = document.querySelector('#inpPreco');
const inpUn = document.querySelector('#inpUn');
const inpQntd = document.querySelector('#inpQntd');
const inpNome = document.querySelector('#inpNome');

const modal = document.querySelector('#modal');
const botaoAdd = document.querySelector('#divInput').firstElementChild;
const botaoSalvar = document.querySelector('#btnSalvar');
const botaoEditar = document.querySelector('#btnEditar');
const botaoCancelar = document.querySelector('#btnCancelar');

// EVENTOS -------------------------------------------------

botaoAdd.addEventListener("click", () => abreModal());
modal.addEventListener('close', () => fechaModal());

botaoSalvar.addEventListener("click", () => addItem());
botaoEditar.addEventListener("click", () => editItem());
botaoCancelar.addEventListener('click', () => modal.close());

// EVENTOS -------------------------------------------------

carregaDados();

function limpaInputs() {
  inpPreco.value = '';
  inpUn.value = '';
  inpQntd.value = '';
  inpNome.value = '';
}

function fechaModal() {
  if(inpNome.getAttribute('data-key')){
    botaoEditar.classList.add('hidden')
    inpNome.removeAttribute('data-key');
  }
  else
    botaoSalvar.classList.add('hidden')
  
  modal.close();
  limpaInputs();
}

function abreModal(item) {
  modal.showModal();

  if(item) {
    const tds = item.children;
    modal.firstElementChild.innerHTML = 'Editar um produto:'

    inpNome.value = tds[0].innerHTML;
    inpQntd.value = tds[1].innerHTML;
    inpUn.value = tds[2].innerHTML;
    inpPreco.value = tds[3].innerHTML;

    inpNome.setAttribute('data-key', item.getAttribute('data-key'));
    botaoEditar.classList.remove('hidden');
  }
  else{
    modal.firstElementChild.innerHTML = 'Adicionar um novo produto:'
    botaoSalvar.classList.remove('hidden');
  }
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

function editItem() {
  const novoItem = {
    "id": Number(inpNome.getAttribute('data-key')),
    "nome": inpNome.value,
    "qntd": inpQntd.value,
    "un": inpUn.value,
    "preco": inpPreco.value
  }
  
  editProduto(novoItem);
  carregaDados();
  fechaModal();
}

function removeItem(item) {
  removeProduto(Number(item));
  carregaDados();
}