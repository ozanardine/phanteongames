const STEAM_API_KEY = '2F7E9C9218555BD019C8A15A61F54A22';
const SERVERS = [
    { id: 1, ip: '154.127.54.57:28080' }
];

// Busca dados do servidor Rust usando a Steam API
async function fetchRustServerData(server) {
    try {
        const response = await fetch(`https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=${STEAM_API_KEY}&filter=\\appid\\252490\\addr\\${server.ip}`);
        const data = await response.json();
        
        if (data.response.servers && data.response.servers.length > 0) {
            const serverData = data.response.servers[0];
            const playersOnline = serverData.players;
            const maxPlayers = serverData.max_players;

            // Atualiza a barra de progresso
            const progressElement = document.getElementById(`playerProgress${server.id}`);
            const percentage = (playersOnline / maxPlayers) * 100;
            progressElement.style.width = percentage + '%';

            // Atualiza a descrição do servidor
            const serverDescriptionElement = document.getElementById(`serverDescription${server.id}`);
            serverDescriptionElement.textContent = `${serverData.name} - ${playersOnline}/${maxPlayers} Jogadores Online`;
        }
    } catch (error) {
        console.error('Erro ao buscar dados do servidor:', error);
    }
}

// Medição de ping
function measurePing(server) {
    const startTime = Date.now();
    const pingText = document.getElementById(`pingText${server.id}`);
    const pingIndicator = document.getElementById(`pingIndicator${server.id}`);

    // Aqui, usamos um serviço que responde rapidamente para medir o ping. Substitua por um endpoint válido.
    fetch(`https://example.com/ping?server=${server.ip}`) // Simule um endpoint que retorne rapidamente
        .then(() => {
            const ping = Date.now() - startTime;
            pingText.textContent = `Ping: ${ping} ms`;
            
            // Define a cor do indicador de ping
            if (ping < 100) {
                pingIndicator.style.backgroundColor = 'green';
            } else if (ping < 200) {
                pingIndicator.style.backgroundColor = 'yellow';
            } else {
                pingIndicator.style.backgroundColor = 'red';
            }
        })
        .catch(() => {
            pingText.textContent = 'Ping: Error';
            pingIndicator.style.backgroundColor = 'red';
        });
}

// Atualiza dados em intervalos regulares
function updateData() {
    SERVERS.forEach(server => {
        fetchRustServerData(server);
        measurePing(server);
    });
}

// Atualiza a cada 10 segundos
setInterval(updateData, 10000);

// Chamada inicial
updateData();
