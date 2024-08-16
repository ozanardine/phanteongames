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
}

// Executar a função para buscar e atualizar os dados quando o documento estiver pronto
fetchServerData();

function saveAlertsToLocalStorage(alerts) {
    const storedAlerts = JSON.parse(localStorage.getItem('rustAlerts')) || [];
    const updatedAlerts = storedAlerts.concat(alerts);
    localStorage.setItem('rustAlerts', JSON.stringify(updatedAlerts));
}

function loadAlertsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('rustAlerts')) || [];
}

function displayAlerts(alerts) {
    const alertsContainer = document.getElementById('alerts-container');
    alertsContainer.innerHTML = ''; // Limpa os avisos anteriores

    alerts.forEach(alert => {
        const alertElement = document.createElement('div');
        alertElement.classList.add('alert');

        const timeElement = document.createElement('span');
        timeElement.classList.add('alert-time');
        timeElement.textContent = alert.timestamp; 

        const messageElement = document.createElement('span');
        messageElement.classList.add('alert-message');
        messageElement.textContent = alert.content; 

        alertElement.appendChild(timeElement);
        alertElement.appendChild(messageElement);

        alertsContainer.appendChild(alertElement);
    });
}

async function fetchRustAlerts() {
    const webhookUrl = 'https://discord.com/api/webhooks/1272694239108661380/IzdkLvPkD9dlK3nJNxBTyvwxoWFVHXAb9suHHTOwhha3E3oi-QAykgnMuk8y9YG6cSqm';

    try {
        const response = await fetch(webhookUrl);
        if (!response.ok) {
            throw new Error('Erro ao buscar alertas do Rust');
        }

        const data = await response.json();
        saveAlertsToLocalStorage(data);
        displayAlerts(loadAlertsFromLocalStorage());
    } catch (error) {
        console.error('Erro ao buscar alertas do Rust:', error);
    }
}

// Carregar alertas do localStorage ao iniciar
displayAlerts(loadAlertsFromLocalStorage());

// Chame a função para buscar alertas a cada 5 segundos
setInterval(fetchRustAlerts, 5000);
fetchRustAlerts(); // Busca inicial
