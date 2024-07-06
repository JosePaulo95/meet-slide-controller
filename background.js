chrome.runtime.onMessage.addListener(gotMessage)

function gotMessage(message) {
  console.log("aaa");
  chrome.tabs.query({ }, function(tabs) {
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
}
