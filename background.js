// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';

(async () => {
  if (!(await hasDocument())) {
    await chrome.offscreen.createDocument({
      url: OFFSCREEN_DOCUMENT_PATH,
      reasons: [chrome.offscreen.Reason.DOM_PARSER],
      justification: 'Parse DOM'
    });
  }
})()

chrome.action.onClicked.addListener(async () => {
  sendMessageToOffscreenDocument(
    'add-exclamationmarks-to-headings',
    '<html><head></head><body><h1>Hello World</h1></body></html>'
  );
});

async function sendMessageToOffscreenDocument(type, data) {
  // Create an offscreen document if one doesn't exist yet
  if (!(await hasDocument())) {
    await chrome.offscreen.createDocument({
      url: OFFSCREEN_DOCUMENT_PATH,
      reasons: [chrome.offscreen.Reason.DOM_PARSER],
      justification: 'Parse DOM'
    });
  }

  // Now that we have an offscreen document, we can dispatch the
  // message.
  chrome.runtime.sendMessage({
    type,
    target: 'offscreen',
    data
  });

}

chrome.runtime.onMessage.addListener(handleMessages);

// This function performs basic filtering and error checking on messages before
// dispatching the message to a more specific message handler.
async function handleMessages(message) {
  // Return early if this message isn't meant for the background script
  if (message.target !== 'background') {
    return;
  }

  if (!(await hasDocument())) {
    await chrome.offscreen.createDocument({
      url: OFFSCREEN_DOCUMENT_PATH,
      reasons: [chrome.offscreen.Reason.DOM_PARSER],
      justification: 'Parse DOM'
    });
  }

  // Dispatch the message to an appropriate handler.
  switch (message.type) {
    case 'add-exclamationmarks-result':
      handleAddExclamationMarkResult(message.data);
      closeOffscreenDocument();
      break;
    case 'update-time':
      updateTime(message.data);
      // closeOffscreenDocument();
      break;
    default:
      console.warn(`Unexpected message type received: '${message.type}'.`);
  }
}

async function handleAddExclamationMarkResult(dom) {
  console.log('Received dom', dom);
}

async function updateTime(data) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { action: 'atualizarContainer', data }, function(response) {
          console.log('Mensagem enviada com sucesso para a aba:', tab.id);
      });
    })
  });
}

async function closeOffscreenDocument() {
  if (!(await hasDocument())) {
    return;
  }
  await chrome.offscreen.closeDocument();
}

async function hasDocument() {
  // Check all windows controlled by the service worker if one of them is the offscreen document
  const matchedClients = await clients.matchAll();
  for (const client of matchedClients) {
    if (client.url.endsWith(OFFSCREEN_DOCUMENT_PATH)) {
      return true;
    }
  }
  return false;
}

// Receber mensagens do content script
// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   if (message.action === 'atualizarHorario') {
//       // Armazenar o último horário recebido
//       localStorage.setItem('ultimoHorario', message.hora);
//   }
// });

// Função para enviar o último horário armazenado de volta ao content script
// async function enviarUltimoHorario() {
//   if (!(await hasDocument())) {
//     await chrome.offscreen.createDocument({
//       url: OFFSCREEN_DOCUMENT_PATH,
//       reasons: [chrome.offscreen.Reason.DOM_PARSER],
//       justification: 'Parse DOM'
//     });
//   }

//   // const ultimoHorario = localStorage.getItem('ultimoHorario');
//   // chrome.runtime.sendMessage({
//   //     action: 'atualizarContainer',
//   //     hora: ultimoHorario
//   // });

//   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, { action: 'atualizarContainer' });
//   });
// }

// Intervalo para enviar o último horário a cada segundo
// setInterval(enviarUltimoHorario, 1000);