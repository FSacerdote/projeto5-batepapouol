axios.defaults.headers.common['Authorization'] = 'thWBkfA2HxJeEDBnysTfueIT';
const login = document.querySelector(".login");
const principal = document.querySelector(".principal");
let idMsg;
let idCon;
let pessoa = {
    name: undefined,
}

// enter enviando mensagem

document.addEventListener("keypress", function(event){
    if (event.key === "Enter" && login.classList.contains("escondido") === true){
        mandaMensagem();
    }
    if (event.key === "Enter" && login.classList.contains("escondido") === false){
        mandaNome();
    }
});

// funções relativas ao nome 

function mandaNome() {
    let input = login.querySelector("input");
    let button = login.querySelector("button");
    let div = login.querySelector("div")
    pessoa = {
        name: input.value,
    }
    let promessaNome = axios.post("https://mock-api.driven.com.br/api/vm/uol/participants", pessoa);
    input.classList.add("escondido");
    button.classList.add("escondido");
    div.classList.remove("escondido");
    promessaNome.catch(erroNome);
    promessaNome.then(funcionamento);
}

function funcionamento (){
    login.classList.add("escondido");
    login.classList.remove("login");
    principal.classList.remove("escondido");
    pegaMensagens();
    if (idMsg === undefined && idCon === undefined){
        idMsg = setInterval(pegaMensagens, 3000);
        idCon = setInterval(mantemConexao, 5000);
    }
    setTimeout(scroll, 2000);
}
function scroll() {
    let container = document.querySelector(".container");
    container.scrollIntoView(false);
}

function erroNome(){
    window.location.reload();
}


// manda mensagem

function mandaMensagem(){
    let input = principal.querySelector("input");
    let mensagem = {
        from: pessoa.name,
	    to: "Todos",
	    text: input.value,
	    type: "message",
    }
    let promessaMensagem = axios.post("https://mock-api.driven.com.br/api/vm/uol/messages", mensagem);
    promessaMensagem.catch(mensagemErro);
    promessaMensagem.then(mensagemSucesso);
}
function mensagemErro(){
    window.location.reload();
}
function mensagemSucesso(){
    let input = principal.querySelector("input");
    pegaMensagens();
    input.value = "";
    scroll();
}

// mantem a conexão

function mantemConexao(){
    let promessaConexao = axios.post("https://mock-api.driven.com.br/api/vm/uol/status", pessoa);
    promessaConexao.then(sucessoConexao);
    promessaConexao.catch(erroConexao);
}
function sucessoConexao(resposta){
    console.log(resposta);
}
function erroConexao(resposta){
    console.log(resposta);
}

// get mensagens

function pegaMensagens(){
    let promessa = axios.get("https://mock-api.driven.com.br/api/vm/uol/messages");
    promessa.then(atualizaPagina);
    promessa.catch(erroPegaMsg);
}
function erroPegaMsg() {
    window.location.reload();    
}
function atualizaPagina(resposta){
    let container = document.querySelector(".container");
    container.innerHTML = "";
    for (let i = 0; i < resposta.data.length; i++) {
        if (resposta.data[i].type === "message") {
            container.innerHTML += `
            <div class="mensagem" data-test="message">
                <p>
                    <strong class="cinza">(${resposta.data[i].time})</strong> <strong class="negrito">${resposta.data[i].from}</strong> para <strong class="negrito">${resposta.data[i].to}</strong>: ${resposta.data[i].text}
                </p>
            </div>
            `;
        }
        if (resposta.data[i].type === "private_message") {
            container.innerHTML += `
            <div class="mensagem reservado" data-test="message">
                <p>
                    <strong class="cinza">(${resposta.data[i].time})</strong> <strong class="negrito">${resposta.data[i].from}</strong> reservadamente para <strong class="negrito">${resposta.data[i].to}</strong>: ${resposta.data[i].text}
                </p>
            </div>
            `;
        }
        if (resposta.data[i].type === "status") {
            container.innerHTML += `
            <div class="mensagem status" data-test="message">
                <p>
                    <strong class="cinza">(${resposta.data[i].time})</strong> <strong class="negrito">${resposta.data[i].from}</strong> ${resposta.data[i].text}
                </p>
            </div>
            `;
        }
        
    }
}