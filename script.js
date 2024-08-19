const SERVER_ID = process.env.BATTLEMETRICS_SERVER_ID;
const API_TOKEN = process.env.BATTLEMETRICS_API_TOKEN;
const sheetId = process.env.GOOGLE_SHEET_ID; // ID da planilha
const sheetName = "Players Database"; // Nome da aba
const apiKey = process.env.GOOGLE_API_KEY; // Chave da API do Google

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
            throw new Error('Erro ao buscar dados da planilha Google Sheets');
        }
        const data = await response.json();
        const rows = data.values;

        const playersContainer = document.querySelector('.players-section');
        playersContainer.innerHTML = ''; // Limpa a seção antes de adicionar novos dados

        rows.slice(1).forEach(row => { // Ignora a primeira linha (cabeçalhos)
            const [steamId, avatarUrl, nickname, kills, deaths, tempoOnline, primeiraConexao] = row;

            const playerElement = document.createElement('div');
            playerElement.classList.add('player');

            playerElement.innerHTML = `
                <img src="${avatarUrl}" alt="${nickname} Avatar">
                <h3>${nickname}</h3>
                <p>Kills: ${kills}</p>
                <p>Deaths: ${deaths}</p>
                <p>Tempo Online: ${tempoOnline} min</p>
                <p>Primeira Conexão: ${primeiraConexao}</p>
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
