function atualizarDataHora() {
    const agora = new Date();
    const data = agora.toLocaleDateString();
    const hora = agora.toLocaleTimeString();
    document.getElementById('datetime').innerText = `${hora} - ${data}`;
}

function carregarHistorico() {
    const historico = JSON.parse(localStorage.getItem('pontos')) || [];
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    historico.forEach((ponto, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${ponto.tipo.toUpperCase()} - ${ponto.horario} (${ponto.latitude || 'N/A'}, ${ponto.longitude || 'N/A'}) 
            - Nota: ${ponto.nota || 'Nenhuma'}
            ${ponto.editado ? '<span class="edit-label">(Editado)</span>' : ''}
            <button class="edit-button" onclick="editarPonto(${index})">Editar</button>
        `;
        historyList.appendChild(li);
    });
}

function marcarPonto(tipo) {
    const agora = new Date();
    const horario = agora.toLocaleTimeString();
    const statusDiv = document.getElementById('status');
    const nota = document.getElementById('nota').value;
    
    statusDiv.innerText = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} marcada às ${horario}`;
    
    function salvarPonto(latitude = null, longitude = null) {
        const novoPonto = {
            tipo: tipo,
            horario: horario,
            data: agora.toLocaleDateString(),
            latitude: latitude,
            longitude: longitude,
            nota: nota,
            editado: false
        };

        const historico = JSON.parse(localStorage.getItem('pontos')) || [];
        historico.push(novoPonto);
        localStorage.setItem('pontos', JSON.stringify(historico));

        document.getElementById('nota').value = '';

        carregarHistorico();
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (posicao) => {
                const latitude = posicao.coords.latitude;
                const longitude = posicao.coords.longitude;
                salvarPonto(latitude, longitude);
            },
            (erro) => {
                console.warn(`Erro ao obter localização: ${erro.message}`);
                salvarPonto();
            }
        );
    } else {
        console.warn("Geolocalização não suportada.");
        salvarPonto();
    }
}

function editarPonto(index) {
    const historico = JSON.parse(localStorage.getItem('pontos')) || [];
    const ponto = historico[index];

    const novaNota = prompt("Edite a nota:", ponto.nota || '');
    if (novaNota !== null) {
        ponto.nota = novaNota;
        ponto.editado = true;
        historico[index] = ponto;

        localStorage.setItem('pontos', JSON.stringify(historico));
        carregarHistorico();
    }
}

setInterval(atualizarDataHora, 1000);

carregarHistorico();