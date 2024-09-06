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

function convertKeyToArrow(key) {
    const arrowKeys = {
        "ArrowLeft": 37,
        "ArrowRight": 39,
        "ArrowUp": 38,
        "ArrowDown": 40
    };

    // Verifica se a key contém alguma das direções e retorna a seta correspondente e o código
    if (key.includes("Left")) {
        return { key: "ArrowLeft", code: arrowKeys["ArrowLeft"] };
    }
    if (key.includes("Right")) {
        return { key: "ArrowRight", code: arrowKeys["ArrowRight"] };
    }
    if (key.includes("Up")) {
        return { key: "ArrowUp", code: arrowKeys["ArrowUp"] };
    }
    if (key.includes("Down")) {
        return { key: "ArrowDown", code: arrowKeys["ArrowDown"] };
    }
    // Se não corresponder a nenhuma seta, retorna null
    return null;
}

function triggerKeyEvent(data, targetSelector) {
    console.log(data);
    // Cria um novo evento de teclado com as propriedades fornecidas
    const event = new KeyboardEvent('keydown', {
        key: convertKeyToArrow(data.key).key,
        code: convertKeyToArrow(data.key).key,
        keyCode: convertKeyToArrow(data.key).code,  // Código da tecla (por exemplo, ArrowRight)
        which: convertKeyToArrow(data.key).code,
        bubbles: true,
        cancelable: true,
        composed: true,
        repeat: false,
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false
    });
    
    // Seleciona o elemento alvo ou usa o documento como padrão
    const canvaContainer = document.querySelector('div.NlMitA') 

    var gdocs_iframe = document.getElementById('myPresentationIframe');
    var googleDocsContainer = gdocs_iframe ? (gdocs_iframe.contentDocument || gdocs_iframe.contentWindow?.document)?.querySelector('body.punch-viewer-body.docsCommonWiz') : null;

    const targetElement = canvaContainer || googleDocsContainer || document;

    console.log(event);

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
    console.log(mouseEvent);
    
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
    
    const rect = document.querySelector('div.P245vb').getBoundingClientRect();
    
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

    // console.log('Evento de mouse capturado e enviado:', eventData);
} catch (error) {
    console.log(error);
}
}

function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
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

    ['click', 'mousedown', 'mouseup', 'dblclick'].forEach(eventType => {
        document.addEventListener(eventType, logAndSendMouseEvent);
    });

    document.addEventListener('mousemove', throttle(function(event) {
        logAndSendMouseEvent(event);
    }, 100));
}

if (!window.location.href.includes("meet")){
    console.log("recebido");
    chrome.runtime.onMessage.addListener(function(message) {
        if (message.action === 'key-down') {
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

if (window.location.href.includes("docs.google.com")) {
    var t = window.location.pathname;
    if (t.includes("/presentation/d/")) {
        var e = t.replace("/presentation/d/", "");
        e.includes("/edit") &&
            (function () {
                var iframe = document.createElement('iframe');
                    iframe.src = window.location.href.replace("edit", "present");
                    iframe.style.zIndex = '-1';
                    iframe.style.position = 'fixed';
                    iframe.style.top = '0';
                    iframe.style.left = '0';
                    iframe.style.width = '100vw';
                    iframe.style.height = '100vh';
                    iframe.style.border = 'none';
                    iframe.id = 'myPresentationIframe';  // Atribuir um ID para controle futuro
                    document.body.appendChild(iframe);
            })(),
            (function () {
                var t = document.createElement("style");
                (t.textContent =
                    "\n    #rfgs_present_with_remote {\n      box-sizing: border-box;\n      border-radius: 20px;\n      font-family: var(--docs-material-header-font-family,Roboto,RobotoDraft,Helvetica,Arial,sans-serif);\n      font-weight: var(--docs-material-font-weight-bold,500);\n      font-size: 14px;\n      height: 40px;\n      letter-spacing: 0.25px;\n      line-height: 16px;\n      background: #f9fbfd;\n      border: 1px solid #747775!important;\n      color: #444746;\n      padding: 10px 14px;\n      margin-right: 8px;\n      text-decoration: none;\n    }\n\n    #rfgs_present_with_remote:hover {\n      background-color: #e8ebee;\n    }\n  "),
                    (document.head || document.documentElement).appendChild(t);
                    var e = document.querySelector(".punch-start-presentation-container"),
                    r = document.createElement("a");
                    (r.id = "rfgs_present_with_remote"),
                    (r.textContent = "Present w/ Remote"),
                    (r.ariaLabel = "Present with Remote for Slides"),
                    (r.dataset.tooltip = "Present with Remote for Slides"),
                    // (r.href = window.location.href.replace("edit", "present")),
                    // (r.target = "_blank"),
                    (r.onclick = function (event) {
                        event.preventDefault();
                        var iframe = document.getElementById('myPresentationIframe');
                        iframe.src = window.location.href.replace("edit", "present");
                        if (iframe) {
                            iframe.style.display = 'block';
                            iframe.requestFullscreen();
                            iframe.contentWindow.focus();
                        }
                    })
                    e.before(r)
            })()
        }
}