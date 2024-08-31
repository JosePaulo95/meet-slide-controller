chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    chrome.tabs.query({ }, function(tabs) {
        console.log(tabs);
        tabs.filter(t => !t.url.includes("meet")).forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { action: 'atualizarContainer', data: message.data }, function(response) {
            if (chrome.runtime.lastError) {
              console.log(tab.url)
              console.log(`Erro ao enviar mensagem para a aba ${tab.id}: ${chrome.runtime.lastError.message}`);
            } else {
              console.log('Mensagem enviada com sucesso para a aba:', tab.id);
            }
          });
        })
    });
});

// Listener para mensagens recebidas
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // Verifica se a mensagem é do tipo 'mouse-event'
  if (message.type === 'mouse-event') {
      // Obtém todas as abas abertas
      chrome.tabs.query({}, function(tabs) {
          // Filtra as abas que não estão no Meet
          tabs.filter(t => !t.url.includes("meet")).forEach(tab => {
              // Envia a mensagem para cada aba, incluindo o evento de mouse
              chrome.tabs.sendMessage(tab.id, { action: 'mouse-event', data: message.data }, function(response) {
                  if (chrome.runtime.lastError) {
                      console.log(tab.url);
                      console.log(`Erro ao enviar mensagem para a aba ${tab.id}: ${chrome.runtime.lastError.message}`);
                  } else {
                      console.log('Mensagem enviada com sucesso para a aba:', tab.id);
                  }
              });
          });
      });
  }
});
