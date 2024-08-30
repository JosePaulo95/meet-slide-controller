// Verificar se a URL atual corresponde a https://www.horariodebrasilia.org/
if (window.location.href.includes("meet.google") || window.location.href.includes("canva")) {
    
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
                endMeeting();
                return;
            }
    
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    
            const displayMinutes = minutes < 10 ? "0" + minutes : minutes;
            const displaySeconds = seconds < 10 ? "0" + seconds : seconds;
    
            timerElement.textContent = `${displayMinutes}:${displaySeconds}`;
        }, 1000);
    }    

    // Função para encerrar a reunião no Meet (supondo que você ainda deseja encerrar a reunião automaticamente)
    function endMeeting() {
        // Se o temporizador está na aba do Canva, talvez você não queira encerrar a reunião automaticamente
        // Se necessário, você pode implementar o código para encerrar a reunião se necessário
    }

    // Adiciona o temporizador à página do Canva
    addTimer();

    const endTimeStr = "11:00"; // Set the desired universal end time
    startTimer(endTimeStr);

}
