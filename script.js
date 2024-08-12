<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phanteon Games</title>
    <link rel="icon" type="image/png" href="https://i.imgur.com/J03GWVQ.png">
    <link rel="stylesheet" href="styles.css">
</head>
<body>

    <div class="header">
        <h1>Phanteon Games</h1>
        <div class="menu">
            <a href="#home">Home</a>
            <a href="#discord">Discord</a>
        </div>
    </div>

    <div class="main">
        <div class="section-header server-header">
            <h2>Servidores Rust</h2>
        </div>
        <div class="servers-section">
            <div class="server-card">
                <div class="server-title">
                    <h2 id="serverName1">Rust Server #1</h2>
                    <span id="serverStatus1" class="status-tag">Offline</span>
                </div>
                <img src="https://via.placeholder.com/300" alt="Rust Server Image">
                <div class="progress-bar">
                    <div class="progress" id="playerProgress1">0/50</div>
                </div>
                <p id="serverDescription1">Descrição breve do servidor aqui.</p>
                <a href="steam://connect/154.127.54.57:28080" class="connect-button">Conectar via Steam</a>
            </div>
        </div>

        <div class="section-header subscription-header">
            <h2>Assinaturas VIP</h2>
        </div>
        <div class="subscription-section">
            <p>Desbloqueie benefícios exclusivos:</p>
            <ul>
                <li>Acesso a áreas especiais do servidor</li>
                <li>Suporte prioritário</li>
                <li>Descontos em itens do jogo</li>
            </ul>
            <p>Planos a partir de R$ 29,99/mês</p>
            <a href="https://pagseguro.uol.com.br" class="subscription-button">PagSeguro</a>
            <a href="https://www.paypal.com" class="subscription-button">PayPal</a>
        </div>
    </div>

    <div class="footer">
        <p>&copy; 2024 Phanteon Games. Todos os direitos reservados.</p>
    </div>

    <script src="script.js"></script>
</body>
</html>
