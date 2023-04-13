axios.defaults.headers.common['Authorization'] = 'thWBkfA2HxJeEDBnysTfueIT';
let nome = prompt("Qual é o seu nome?")
let pessoa = {
    name: nome,
}
let promessaNome = axios.post("https://mock-api.driven.com.br/api/vm/uol/participants", pessoa);
promessaNome.catch(erroNome);
promessaNome.then(funcionamento);

function funcionamento (){
    pegaMensagens();
    setInterval(pegaMensagens, 3000);
    setInterval(mantemConexao, 5000);
}

function mandaMensagem(){
    const input = document.querySelector("input");
    let mensagem = {
        from: pessoa.name,
	    to: "Todos",
	    text: input.value,
	    type: "message"
    }
    let promessaMensagem = axios.post("https://mock-api.driven.com.br/api/vm/uol/messages", mensagem);
    promessaMensagem.catch(mensagemErro);
    promessaMensagem.then(mensagemSucesso);
}
function mensagemErro(){
    window.location.reload();
}
function mensagemSucesso(){
    const input = document.querySelector("input");
    pegaMensagens();
    input.value = "";
}

function mantemConexao(){
    const promessaConexao = axios.post("https://mock-api.driven.com.br/api/vm/uol/status", pessoa);
}
function erroNome(){
    nome = prompt("Qual é o seu nome?(escolha outro nome)");
    pessoa = {
        name: nome,
    }
    promessaNome = axios.post("https://mock-api.driven.com.br/api/vm/uol/participants", pessoa);
    promessaNome.catch(erroNome);
    promessaNome.then(funcionamento);
}

function pegaMensagens(){
    let promessa = axios.get("https://mock-api.driven.com.br/api/vm/uol/messages");
    promessa.then(atualizaPagina);
}
function atualizaPagina(resposta){
    const container = document.querySelector(".container");
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
            <div class="mensagem" data-test="message">
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