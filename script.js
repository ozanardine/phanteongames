const RCON_PASSWORD = '968570';
const SERVER_IP = '154.127.54.57';
const RCON_PORT = 28016;

async function connectWebRCON() {
    const socket = new WebSocket(`ws://${SERVER_IP}:${RCON_PORT}/${RCON_PASSWORD}`);

    socket.onopen = () => {
        console.log('Conectado ao WebRCON');
        // Envie o comando para obter a lista de jogadores
        socket.send(JSON.stringify({ Identifier: 1, Message: "playerlist", Name: "WebRcon" }));
    };

    socket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.Identifier === 1) {
            const playerData = JSON.parse(response.Message);
            console.log(playerData);
            // Atualize as informações no seu site
            updatePlayerInfo(playerData);
        }
    };

    socket.onerror = (error) => {
        console.error('Erro no WebRCON:', error);
    };

    socket.onclose = () => {
        console.log('Conexão com o WebRCON fechada');
        // Tentar reconectar após algum tempo
        setTimeout(connectWebRCON, 5000);
    };
}

function updatePlayerInfo(playerData) {
    const playersOnline = playerData.Players.length;
    const maxPlayers = 100; // Defina a capacidade máxima de jogadores do seu servidor

    // Atualize a barra de progresso e a descrição
    const progressElement = document.getElementById('playerProgress1');
    const percentage = (playersOnline / maxPlayers) * 100;
    progressElement.style.width = percentage + '%';

    const serverDescriptionElement = document.getElementById('serverDescription1');
    serverDescriptionElement.textContent = `Rust Server #1 - ${playersOnline}/${maxPlayers} Jogadores Online`;
}

// Chamada inicial para conectar ao WebRCON
connectWebRCON();
