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
    const maxPlayers = 50;
    const serverStatus = serverData.status;
    const serverName = serverData.name;  // Nome do servidor do BattleMetrics

    const statusTag = document.getElementById('serverStatus1');
    statusTag.textContent = serverStatus.charAt(0).toUpperCase() + serverStatus.slice(1);
    statusTag.className = `status-tag ${serverStatus.toLowerCase()}`;

    const progressElement = document.getElementById('playerProgress1');
    const percentage = (playersOnline / maxPlayers) * 100;
    progressElement.style.width = `${percentage}%`;
    progressElement.textContent = `${playersOnline}/${maxPlayers}`;

    const serverNameElement = document.getElementById('serverNameDisplay');
    serverNameElement.textContent = serverName; // Exibir o nome real do servidor

    const serverDescriptionElement = document.getElementById('serverDescription1');
    serverDescriptionElement.textContent = "Descrição breve do servidor aqui.";
}

fetchServerData();
