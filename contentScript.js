// Verificar se a URL atual corresponde a https://www.horariodebrasilia.org/
if (window.location.href === "https://www.horariodebrasilia.org/") {
    
    setInterval(() => {
        const horaElement = document.querySelector('#relogio'); // Substitua pelo seletor correto
        const horaAtual = horaElement.innerHTML; // Captura o texto do elemento que mostra o horário
        chrome.runtime.sendMessage({
            type: 'update-time',
            target: 'background',
            data: horaAtual
        });
    }, 1000);
} else {
    // Se não estiver na página desejada, exibir o container com o último horário recebido
    const container = document.createElement('div');
    container.id = 'meet-extension-container';
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.backgroundColor = 'rgba(255, 0, 255, 0.8)';
    container.style.padding = '10px';
    container.textContent = 'Hello World'; // Mensagem inicial ou última mensagem recebida
    document.body.appendChild(container);

    // Receber mensagens do background script
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.action === 'atualizarContainer') {
            container.textContent = `Horário atual: ${message.data}`;
        }
    });
}
