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
        } else {
            console.log('Servidor não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao buscar dados do servidor:', error);
    }
}

// Atualiza dados em intervalos regulares
function updateData() {
    SERVERS.forEach(server => {
        fetchRustServerData(server);
    });
}

// Atualiza a cada 10 segundos
setInterval(updateData, 10000);

// Chamada inicial
updateData();
