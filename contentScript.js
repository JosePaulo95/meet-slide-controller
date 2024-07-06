const createContainerObserver = () => {
    return new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // Verifica se foram adicionados nós e se há um elemento img[data-emoji]
            const addedNode = mutation.addedNodes[0];
            if (addedNode) {
                const news = addedNode.querySelector('img[data-emoji]')?.getAttribute('data-emoji');
                if (news) {
                    chrome.runtime.sendMessage({
                        type: 'update-time',
                        target: 'background',
                        data: news
                    });
                }
            }
        });
    });
}

const createMeetBodyObserver = () => {
    return new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node instanceof HTMLElement && node.matches('.hcgJqc')) {
                    console.log('Elemento desejado detectado:', node);
                    const containerObserver = createContainerObserver()
                    containerObserver.observe(node, { childList: true });
                }
            });
        });
    });
}

// Verificar se a URL atual corresponde a https://www.horariodebrasilia.org/
if (window.location.href.includes("meet.google")) {
    const containerNode = document.querySelector(".hcgJqc");
    if(!containerNode){
        const bodyObserver = createMeetBodyObserver()
        bodyObserver.observe(document.body, { childList: true, subtree: true });
    }else{
        const containerObserver = createContainerObserver()
        containerObserver.observe(targetNode, { childList: true });
    }
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
    chrome.runtime.onMessage.addListener(function(message) {
        if (message.action === 'atualizarContainer') {
          container.textContent = `Horário atual: ${message.data}`;
        }
    });
}
