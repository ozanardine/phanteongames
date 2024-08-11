const STEAM_API_KEY = '2F7E9C9218555BD019C8A15A61F54A22';
const SERVER_IP = '45.88.229.94:28017'; // Coloque o IP do servidor

// Busca dados do servidor Rust usando a Steam API
async function fetchRustServerData() {
    try {
        const response = await fetch(`https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=${STEAM_API_KEY}&filter=\\appid\\252490\\addr\\${SERVER_IP}`);
        const data = await response.json();
        
        if (data.response.servers && data.response.servers.length > 0) {
            const server = data.response.servers[0];
            const playersOnline = server.players;
            const maxPlayers = server.max_players;

            // Atualiza a barra de progresso
            const progressElement = document.getElementById('playerProgress');
            const percentage = (playersOnline / maxPlayers) * 100;
            progressElement.style.width = percentage + '%';

            // Atualiza a descrição do servidor
            const serverDescriptionElement = document.getElementById('serverDescription');
            serverDescriptionElement.textContent = `${server.name} - ${playersOnline}/${maxPlayers} Jogadores Online`;
        }
    } catch (error) {
        console.error('Erro ao buscar dados do servidor:', error);
    }
}

// Medição de ping
function measurePing() {
    const startTime = Date.now();
    const pingText = document.getElementById('pingText');
    const pingIndicator = document.getElementById('pingIndicator');
    
    fetch('https://api.github.com') // Usar um endpoint rápido para teste
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
    fetchRustServerData();
    measurePing();
}

// Atualiza a cada 10 segundos
setInterval(updateData, 10000);

// Chamada inicial
updateData();
