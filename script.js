axios.defaults.headers.common['Authorization'] = 'thWBkfA2HxJeEDBnysTfueIT';
let nome = prompt("Qual é o seu nome?")
let pessoa = {
    name: nome,
}
let promessaNome = axios.post("https://mock-api.driven.com.br/api/vm/uol/participants", pessoa);
promessaNome.catch(erroNome);
pegaMensagens();
setInterval(pegaMensagens, 3000);

function erroNome(){
    nome = prompt("Qual é o seu nome?(escolha outro nome)");
    pessoa = {
        name: nome,
    }
    promessaNome = axios.post("https://mock-api.driven.com.br/api/vm/uol/participants", pessoa);
    promessaNome.catch(erroNome);
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
            <div class="mensagem">
                <p>
                    <strong class="cinza">(${resposta.data[i].time})</strong> <strong class="negrito">${resposta.data[i].from}</strong> para <strong class="negrito">${resposta.data[i].to}</strong>: ${resposta.data[i].text}
                </p>
            </div>
            `;
        }
        if (resposta.data[i].type === "private_message") {
            container.innerHTML += `
            <div class="mensagem">
                <p>
                    <strong class="cinza">(${resposta.data[i].time})</strong> <strong class="negrito">${resposta.data[i].from}</strong> reservadamente para <strong class="negrito">${resposta.data[i].to}</strong>: ${resposta.data[i].text}
                </p>
            </div>
            `;
        }
        if (resposta.data[i].type === "status") {
            container.innerHTML += `
            <div class="mensagem status">
                <p>
                    <strong class="cinza">(${resposta.data[i].time})</strong> <strong class="negrito">${resposta.data[i].from}</strong> ${resposta.data[i].text}
                </p>
            </div>
            `;
        }
        
    }
}