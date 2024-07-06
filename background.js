chrome.runtime.onMessage.addListener(gotMessage)

function gotMessage(message, sender, sendResponse) {
  console.log(message);
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { action: 'atualizarContainer', data: message.data }, function(response) {
          console.log('Mensagem enviada com sucesso para a aba:', tab.id);
      });
    })
  });
}