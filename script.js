const SERVER_ID = '28926430'; // ID do seu servidor no BattleMetrics
const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjVkYWQxOTZjZjM0NGM5NWQiLCJpYXQiOjE3MjM0MzE1OTYsIm5iZiI6MTcyMzQzMTU5NiwiaXNzIjoiaHR0cHM6Ly93d3cuYmF0dGxlbWV0cmljcy5jb20iLCJzdWIiOiJ1cm46dXNlcjoxNzI3NzAifQ.QaKllPjTEj0HHLbbh5BI1ePZ9GqO9FJ3MjnY_DMDM0c'; // Sua chave de API do BattleMetrics

async function fetchServerData() {
    try {
        const response = await fetch(`https://api.battlemetrics.com/servers/${SERVER_ID}`, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar dados do servidor');
        }

        const data = await response.json();
        const serverData = data.data.attributes;

        // Exibir informações no site
        updateServerInfo(serverData);
    } catch (error) {
        console.error('Erro:', error);
    }
}

function updateServerInfo(serverData) {
    const playersOnline = serverData.players;
    const maxPlayers = 50; // Capacidade máxima de jogadores
    const serverStatus = serverData.status;
    const serverName = serverData.name; // Nome do servidor do BattleMetrics

    // Atualizar o status e aplicar a classe para coloração
    const statusTag = document.getElementById('serverStatus1');
    statusTag.textContent = serverStatus.charAt(0).toUpperCase() + serverStatus.slice(1);
    statusTag.className = `status-tag ${serverStatus.toLowerCase()}`;

    // Atualizar a barra de progresso visual
    const progressElement = document.getElementById('playerProgress');
    const percentage = (playersOnline / maxPlayers) * 100;
    progressElement.style.width = `${percentage}%`;

    // Atualizar o texto de progresso, garantindo centralização
    const progressText = document.getElementById('playerProgressText');
    progressText.textContent = `${playersOnline}/${maxPlayers}`;

    // Atualizar o nome do servidor exibido
    const serverNameElement = document.getElementById('serverNameDisplay');
    serverNameElement.textContent = serverName;

    // Atualizar a descrição breve do servidor
    const serverDescriptionElement = document.getElementById('serverDescription1');
    serverDescriptionElement.textContent = "Descrição breve do servidor aqui.";
}

// Executar a função para buscar e atualizar os dados quando o documento estiver pronto
fetchServerData();

