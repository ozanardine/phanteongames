const SERVER_ID = '28926430';
const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjVkYWQxOTZjZjM0NGM5NWQiLCJpYXQiOjE3MjM0MzE1OTYsIm5iZiI6MTcyMzQzMTU5NiwiaXNzIjoiaHR0cHM6Ly93d3cuYmF0dGxlbWV0cmljcy5jb20iLCJzdWIiOiJ1cm46dXNlcjoxNzI3NzAifQ.QaKllPjTEj0HHLbbh5BI1ePZ9GqO9FJ3MjnY_DMDM0c';
const sheetId = '1eIi_8UMQFVlOAEkYj02z6zPGhLrSpa7Z2R9nBWALBgY';
const sheetName = "Players Database";

// Extraindo chave de API (se necessário)
const apiKey = 'AIzaSyANlTK849OfuL11dkyRZF5xo5DVqfuVDNE';

// Função para buscar dados do servidor BattleMetrics
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

// Função para buscar alertas do Rust
async function fetchRustAlerts() {
    const webhookUrl = 'https://discord.com/api/webhooks/1272694239108661380/IzdkLvPkD9dlK3nJNxBTyvwxoWFVHXAb9suHHTOwhha3E3oi-QAykgnMuk8y9YG6cSqm';

    try {
        const response = await fetch(webhookUrl);
        if (!response.ok) {
            throw new Error('Erro ao buscar alertas do Rust');
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            console.log('Nenhum dado de alerta válido recebido.');
            return;
        }

        const alertsContainer = document.getElementById('alerts-container');
        alertsContainer.innerHTML = ''; // Limpa os avisos anteriores

        data.forEach(alert => {
            // Verifica se o conteúdo do alerta é válido
            if (alert && alert.timestamp && alert.content) {
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
            }
        });

    } catch (error) {
        console.error('Erro ao buscar alertas do Rust:', error);
    }
}

// Função para buscar dados dos jogadores no Google Sheets
async function fetchPlayerData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ao buscar dados da planilha Google Sheets: ${errorText}`);
        }
        const data = await response.json();
        const rows = data.values;

        const playersContainer = document.querySelector('.players-section');
        const existingTitle = playersContainer.querySelector('h2').outerHTML;
        playersContainer.innerHTML = existingTitle;

        rows.slice(1).forEach((row, index) => {
            const [steamId, avatarUrl, nickname, kills, deaths, status] = row;

            const playerElement = document.createElement('div');
            playerElement.classList.add('player');

            if (index === 0) {
                playerElement.classList.add('rank-1');
            } else if (index === 1) {
                playerElement.classList.add('rank-2');
            } else if (index === 2) {
                playerElement.classList.add('rank-3');
            } else {
                playerElement.classList.add('rank-default');
            }

            const rankNumber = index + 1;
            const crownIcon = index <= 2 ? 'fas fa-crown' : '';
            playerElement.innerHTML = `
                <div class="rank-number">
                    <i class="${crownIcon} crown"></i>
                    ${rankNumber}
                </div>
                <img src="${avatarUrl}" alt="${nickname} Avatar">
                <div class="data-item">
                    <span class="title">Nickname</span>
                    <span class="value">${nickname}</span>
                </div>
                <div class="data-item">
                    <span class="title"><i class="fas fa-skull icon"></i> Kills</span>
                    <span class="value">${kills}</span>
                </div>
                <div class="data-item">
                    <span class="title"><i class="fas fa-heart-broken icon"></i> Deaths</span>
                    <span class="value">${deaths}</span>
                </div>
                <div class="player-status">
                    <span class="status-indicator ${status === 'online' ? 'online' : 'offline'}"></span>
                </div>
            `;
            playersContainer.appendChild(playerElement);
        });
    } catch (error) {
        console.error('Erro ao buscar dados dos jogadores:', error);
    }
}

// Inicializa as funções ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    fetchServerData();
    fetchRustAlerts();
    fetchPlayerData();
});

// Chame a função para buscar alertas a cada 5 segundos
setInterval(fetchRustAlerts, 5000);
