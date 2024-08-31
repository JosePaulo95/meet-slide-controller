function addTimer() {
    const timerContainer = document.createElement('div');
    timerContainer.style.position = 'fixed';
    timerContainer.style.top = '1px';     
    timerContainer.style.left = '5px';  // Corrected to align with the top-right corner
    timerContainer.style.color = 'black';
    timerContainer.style.backgroundColor = 'rgba(256,256,256,0.7)';
    timerContainer.style.border = '1px solid black';
    timerContainer.style.borderRadius = '5%';
    timerContainer.style.padding = '10px';
    timerContainer.style.zIndex = '1000';
    timerContainer.style.fontSize = '21px';
    timerContainer.style.fontFamily = 'monospace';
    timerContainer.style.minHeight = '25px';
    timerContainer.style.minWidth = '50px';
    timerContainer.style.display = 'flex';
    timerContainer.style.alignItems = 'center';
    timerContainer.style.justifyContent = 'center';
    timerContainer.id = 'canva-timer';

    const timerText = document.createElement('span');
    timerText.id = 'timer-text';
    timerText.textContent = '30:00';

    timerContainer.appendChild(timerText);
    document.body.appendChild(timerContainer);

    timerContainer.addEventListener('mouseenter', () => {
        // timerContainer.style.opacity = '0';
        // timerContainer.style.pointerEvents = 'none'; 
    });
    
    timerContainer.addEventListener('mouseleave', () => {
        setTimeout(() => {
            timerContainer.style.opacity = '1';
            timerContainer.style.pointerEvents = 'auto'; 
        }, 2000); 
    });
            
}

function startTimer(endTimeStr) {
    const [endHour, endMinute] = endTimeStr.split(':').map(Number);
    
    // Create a Date object for today with the specified end time
    const now = new Date();
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute, 0, 0).getTime();
    
    // Adjust for the next day if end time is earlier than current time
    if (endTime < now.getTime()) {
        endTime += 24 * 60 * 60 * 1000; // Add one day in milliseconds
    }

    const timerElement = document.getElementById('timer-text');

    const interval = setInterval(function () {
        const currentTime = new Date().getTime();
        const remainingTime = endTime - currentTime;

        if (remainingTime <= 0) {
            clearInterval(interval);
            timerElement.textContent = "00:00";
            if (window.location.href.includes("meet.google")){
                endMeeting();
            }
            return;
        }

        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        const displayMinutes = minutes < 10 ? "0" + minutes : minutes;
        const displaySeconds = seconds < 10 ? "0" + seconds : seconds;

        timerElement.textContent = `${displayMinutes}:${displaySeconds}`;
    }, 1000);
}    

function endMeeting() {
    function clickFirstButton() {
        var firstButton = document.querySelector('[jsname="CQylAd"]');
        if (firstButton) {
            firstButton.click();
            // Espere o popup de confirmação aparecer
            setTimeout(clickSecondButton, 500); // Ajuste o tempo conforme necessário
        } else {
            console.log('Primeiro botão não encontrado');
        }
    }
    
    // Função para clicar no botão com jsname="V67aGc"
    function clickSecondButton() {
        var secondButton = document.querySelector('.VfPpkd-T0kwCb button[jscontroller="soHxf"] span[jsname="V67aGc"]');
        if (secondButton) {
            secondButton.click();
        } else {
            console.log('Segundo botão não encontrado');
        }
    }
    
    // Execute a função para clicar no primeiro botão
    clickFirstButton();
}

function triggerKeyEvent(data, targetSelector = 'div.NlMitA') {
    // Cria um novo evento de teclado com as propriedades fornecidas
    const event = new KeyboardEvent('keydown', {
        key: data.key,
        code: data.key,
        keyCode: data.code,  // Código da tecla (por exemplo, ArrowRight)
        which: data.code,
        bubbles: true,
        cancelable: true,
        composed: true
    });
    
    // Seleciona o elemento alvo ou usa o documento como padrão
    const targetElement = document.querySelector(targetSelector) || document;
    
    // Dispara o evento no elemento alvo
    targetElement.dispatchEvent(event);
}

function triggerMouseEvent(eventData) {
    // Obtém o tamanho da janela
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Converte percentuais para coordenadas absolutas
    const clientX = eventData.percentageX * windowWidth;
    const clientY = eventData.percentageY * windowHeight;

    // Cria o evento de mouse com as coordenadas ajustadas
    const mouseEvent = new MouseEvent(eventData.type, {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: clientX,
        clientY: clientY,
        // Inclua outros dados do evento conforme necessário
    });

    // Encontra o elemento no ponto onde o evento deve ser disparado
    const targetElement = document.elementFromPoint(clientX, clientY);
    if (targetElement) {
        targetElement.dispatchEvent(mouseEvent);
        console.log('Evento de mouse reproduzido:', eventData.type);
    } else {
        console.log('Elemento alvo não encontrado.');
    }
}

function logAndSendMouseEvent(event) {
try {
    
    const rect = document.querySelector('div.aIECPd').getBoundingClientRect();
    
    // Calcula percentuais
    const percentageX = (event.clientX - rect.left) / rect.width;
    const percentageY = (event.clientY - rect.top) / rect.height;

    const eventData = {
        type: event.type,
        clientX: event.clientX,
        clientY: event.clientY,
        screenX: event.screenX,
        screenY: event.screenY,
        button: event.button,
        buttons: event.buttons,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        metaKey: event.metaKey,
        movementX: event.movementX,
        movementY: event.movementY
    };

    // Envia o evento para o background ou outra aba
    chrome.runtime.sendMessage({
        type: 'mouse-event',
        target: 'background',
        data: {
            type: eventData.type,
            percentageX: percentageX,
            percentageY: percentageY,
            // Inclua outros dados do evento conforme necessário
        }
    });

    console.log('Evento de mouse capturado e enviado:', eventData);
} catch (error) {
    console.log(error);
}
}

if (window.location.href.includes("meet.google")){
    // Envia mensagem para uma aba específica
    
    document.addEventListener('keydown', function(event) {
        console.log('Tecla pressionada:', event.key);

        chrome.runtime.sendMessage({
            type: 'hello',
            target: 'background',
            data: {key: event.key, code: event.code}
        });
    });

    ['mousemove', 'click', 'mousedown', 'mouseup', 'dblclick'].forEach(eventType => {
        document.addEventListener(eventType, logAndSendMouseEvent);
    });
}

if (window.location.href.includes("canva")){
    console.log("recebido");
    chrome.runtime.onMessage.addListener(function(message) {
        if (message.action === 'atualizarContainer') {
            triggerKeyEvent(message.data);
        }
        if (message.action === 'mouse-event') {
            triggerMouseEvent(message.data)
        }
    });
}

// Verificar se a URL atual corresponde a https://www.horariodebrasilia.org/
if (window.location.href.includes("meet.google") || window.location.href.includes("canva")) {
    // Adiciona o temporizador à página do Canva
    addTimer();

    const endTimeStr = "11:03"; // Set the desired universal end time
    // startTimer(endTimeStr); //TEMP
}
