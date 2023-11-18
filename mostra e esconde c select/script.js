import { produtos, addProduto, editProduto, removeProduto, getOpcoes } from './data.js';


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
inpUn.addEventListener('focusin', (e) => {
  if(e.target.parentElement.nextElementSibling.classList.contains('hidden'))
    e.target.parentElement.classList.add('ring', 'border-blue-400');
  else
    e.target.parentElement.classList.add('ring', 'ring-red-200');

  e.target.nextElementSibling.classList.add('rotate-180', '-translate-x-2');
});

inpUn.addEventListener('focusout', (e) => {
  if(e.target.parentElement.nextElementSibling.classList.contains('hidden'))
    e.target.parentElement.classList.remove('ring', 'border-blue-400');
  else
    e.target.parentElement.classList.remove('ring', 'ring-red-200');

  e.target.nextElementSibling.classList.remove('rotate-180', '-translate-x-2');
});

botaoSalvar.addEventListener("click", () => addItem());
botaoEditar.addEventListener("click", () => editItem());
botaoCancelar.addEventListener('click', () => modal.close());

// EVENTOS -------------------------------------------------

carregaOpcoes();
carregaDados();

function limpaValidacaoInputs() {
  inpNome.className = "mt-1 py-3 px-4 border border-slate-300 rounded-md hover:border-blue-400 focus:ring focus:border-blue-400 focus:outline-none";
  inpNome.nextElementSibling.classList.add('hidden');

  inpQntd.className = "mt-1 py-3 px-4 border border-slate-300 rounded-md hover:border-blue-400 focus:ring focus:border-blue-400 focus:outline-none";
  inpQntd.nextElementSibling.classList.add('hidden');

  inpUn.parentElement.className = "flex items-center mt-1 border border-slate-300 rounded-md hover:border-blue-400 relative pointer-events-none";
  inpUn.value = "-1"
  
  inpUn.parentElement.nextElementSibling.classList.add('hidden');

  inpPreco.className = "mt-1 py-3 px-4 border border-slate-300 rounded-md hover:border-blue-400 focus:ring focus:border-blue-400 focus:outline-none";
  inpPreco.nextElementSibling.classList.add('hidden');
}

function limpaInputs() {

  inpNome.value = '';
  inpQntd.value = '';
  inpUn.value = '-1';
  inpPreco.value = '';

  limpaValidacaoInputs();
}

function validaInputs(item) {  
  limpaValidacaoInputs();

  if (item.nome == "" || (item.qntd == "" || Number.isNaN(Number(item.qntd)))
    || item.un == "-1" || (item.preco == "" || Number.isNaN(Number(item.preco)))) {

    if (item.nome == "") {
      inpNome.classList.remove('border-slate-300', 'hover:border-blue-400', 'focus:ring', 'focus:border-blue-400');
      inpNome.classList.add('border-red-400', 'focus:ring', 'focus:ring-red-200');
      inpNome.nextElementSibling.classList.remove('hidden');
    }
    if (item.qntd == "" || Number.isNaN(Number(item.qntd))) {
      inpQntd.classList.remove('border-slate-300', 'hover:border-blue-400', 'focus:ring', 'focus:border-blue-400');
      inpQntd.classList.add('border-red-400', 'focus:ring', 'focus:ring-red-200');
      inpQntd.nextElementSibling.innerHTML = item.qntd == ""? "* Campo Obrigatório":"* Valor Inválido";
      inpQntd.nextElementSibling.classList.remove('hidden');
    }
    if (item.un == "-1") {
      inpUn.parentElement.classList.remove('border-slate-300', 'hover:border-blue-400');
      inpUn.parentElement.classList.add('border-red-400');
      inpUn.parentElement.nextElementSibling.classList.remove('hidden');
    }
    if (item.preco == "" || Number.isNaN(Number(item.preco))) {
      inpPreco.classList.remove('border-slate-300', 'hover:border-blue-400', 'focus:ring', 'focus:border-blue-400');
      inpPreco.classList.add('border-red-400', 'focus:ring', 'focus:ring-red-200');
      inpPreco.nextElementSibling.innerHTML = item.preco == ""? "* Campo Obrigatório":"* Valor Inválido";
      inpPreco.nextElementSibling.classList.remove('hidden');
    }
    return false;
  }

  return true;
}

function fechaModal() {
  if (inpNome.getAttribute('data-key')) {
    botaoEditar.classList.add('hidden')
    inpNome.removeAttribute('data-key');
  }
  else
    botaoSalvar.classList.add('hidden');

  modal.close();
  limpaInputs();
}

function abreModal(item) {
  modal.showModal();

  if (item) {
    const tds = item.children;
    const opcs = Array.from(inpUn.children).map((el) => ({"key": el.value, "value": el.innerHTML}));
    
    modal.firstElementChild.innerHTML = 'Editar um produto:'
    inpNome.value = tds[0].innerHTML;
    inpQntd.value = tds[1].innerHTML;
    inpUn.value = opcs.find(opc => opc.value == tds[2].innerHTML)?.key;
    inpPreco.value = tds[3].innerHTML;

    inpNome.setAttribute('data-key', item.getAttribute('data-key'));
    botaoEditar.classList.remove('hidden');
  }
  else {
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

function carregaOpcoes() {
  const opcoes = getOpcoes();
  opcoes.forEach((op, idx) => inpUn.innerHTML += `<option value="${idx}">${op}</option>`); 
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
          <button data-key="${id}" class="bg-amber-50 px-1 rounded-md hover:bg-amber-100 focus:ring focus:ring-amber-100 focus:outline-none" name="editBtn">
            <span class="material-symbols-outlined text-xl text-amber-400">edit</span>
          </button>
          <button data-key="${id}" class="bg-red-50 px-1 rounded-md hover:bg-red-100 focus:ring focus:ring-red-100 focus:outline-none" name="removeBtn">
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
   const opcs = Array.from(inpUn.children).map((el) => ({"key": el.value, "value": el.innerHTML}));
  
  const item = {
    "id": 0,
    "nome": inpNome.value,
    "qntd": inpQntd.value,
    "un": opcs.find(opc => opc.key == inpUn.value)?.value,
    "preco": inpPreco.value
  }

  if(validaInputs(item)){
    addProduto(item);
    carregaDados();
    fechaModal();
  }
}

function editItem() {
  const opcs = Array.from(inpUn.children).map((el) => ({"key": el.value, "value": el.innerHTML}));
  
  const novoItem = {
    "id": Number(inpNome.getAttribute('data-key')),
    "nome": inpNome.value,
    "qntd": inpQntd.value,
    "un": opcs.find(opc => opc.key == inpUn.value)?.value,
    "preco": inpPreco.value
  }

  if(validaInputs(novoItem)){
    editProduto(novoItem);
    carregaDados();
    fechaModal();
  }
}

function removeItem(item) {
  removeProduto(Number(item));
  carregaDados();
}
