const SERVER_ID = '28926430'; // ID do seu servidor no BattleMetrics
const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjVkYWQxOTZjZjM0NGM5NWQiLCJpYXQiOjE3MjM0MzE1OTYsIm5iZiI6MTcyMzQzMTU5NiwiaXNzIjoiaHR0cHM6Ly93d3cuYmF0dGxlbWV0cmljcy5jb20iLCJzdWIiOiJ1cm46dXNlcjoxNzI3NzAifQ.QaKllPjTEj0HHLbbh5BI1ePZ9GqO9FJ3MjnY_DMDM0c';

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
    const maxPlayers = serverData.maxPlayers;
    const serverName = serverData.name;
    const serverStatus = serverData.status;

    const progressElement = document.getElementById('playerProgress1');
    const percentage = (playersOnline / maxPlayers) * 100;
    progressElement.style.width = percentage + '%';

    const serverDescriptionElement = document.getElementById('serverDescription1');
    serverDescriptionElement.textContent = `${serverName} - ${playersOnline}/${maxPlayers} Jogadores Online - Status: ${serverStatus}`;
}

// Chamada inicial para buscar dados
fetchServerData();
