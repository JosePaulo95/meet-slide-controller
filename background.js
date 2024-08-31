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


// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   if (message.action === 'key-down') {
//       console.log('Tecla pressionada:', message.data.key);
//       console.log('KeyCode:', message.data.keyCode);
//       // Adicione a lógica que você deseja aqui, por exemplo, enviar a mensagem para outras abas
//   }
// });