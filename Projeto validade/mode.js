// Formatador de Moeda
const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});

// 1. Garantir que o JS só rode após o DOM carregar (Evita falhas silenciosas de IDs não encontrados)
document.addEventListener('DOMContentLoaded', () => {
    
    const formSimulador = document.getElementById('ai-form');

    // Validação de segurança: verifica se o formulário existe na página
    if (!formSimulador) {
        console.error("ERRO: Formulário com ID 'ai-form' não encontrado.");
        return;
    }

    formSimulador.addEventListener('submit', function(event) {
        // 2. Bloqueia o recarregamento padrão da página IMEDIATAMENTE
        event.preventDefault(); 

        try {
            // 3. Captura e conversão rigorosa dos dados numéricos (Number/parseFloat/parseInt)
            const inputNome = document.getElementById('produtoNome');
            const inputQtd = document.getElementById('produtoQtd');
            const inputDias = document.getElementById('produtoDias');
            const inputPreco = document.getElementById('produtoPreco');

            // Verifica se todos os inputs existem no DOM
            if (!inputNome || !inputQtd || !inputDias || !inputPreco) {
                throw new Error("Um ou mais IDs de input não correspondem ao HTML.");
            }

            const nomeProduto = inputNome.value.trim();
            const quantidade = parseInt(inputQtd.value, 10);
            const diasParaVencer = parseInt(inputDias.value, 10);
            const precoAtual = parseFloat(inputPreco.value);

            // Validação contra NaN (Not a Number)
            if (isNaN(quantidade) || isNaN(diasParaVencer) || isNaN(precoAtual)) {
                alert("Por favor, insira valores numéricos válidos.");
                return;
            }

            // --- LÓGICA DE NEGÓCIO ---
            const valorEmRisco = quantidade * precoAtual;
            let percentualDesconto = 0;

            if (diasParaVencer <= 2) {
                percentualDesconto = 40;
            } else if (diasParaVencer <= 5) {
                percentualDesconto = 25;
            }

            const ativarCombo = quantidade > 100;
            const alertaUrgente = valorEmRisco > 1000;

            // --- MANIPULAÇÃO DO DOM ---
            document.getElementById('res-nome').innerText = nomeProduto;
            document.getElementById('res-valor-risco').innerText = formatadorMoeda.format(valorEmRisco);
            document.getElementById('res-dias').innerText = `${diasParaVencer} dia(s)`;

            const txtDescontoElem = document.getElementById('txt-desconto');
            if (percentualDesconto > 0) {
                const novoPreco = precoAtual * (1 - percentualDesconto / 100);
                txtDescontoElem.innerHTML = `Desconto sugerido: <strong>${percentualDesconto}%</strong>. Novo preço: <strong>${formatadorMoeda.format(novoPreco)}</strong>.`;
            } else {
                txtDescontoElem.innerHTML = 'Manter preço original. Prazo seguro.';
            }

            // Alterna classes de Combo
            const acaoComboElem = document.getElementById('acao-combo');
            if (ativarCombo) {
                acaoComboElem.classList.remove('hidden');
                acaoComboElem.classList.add('flex'); // Se usar Tailwind flex
            } else {
                acaoComboElem.classList.add('hidden');
                acaoComboElem.classList.remove('flex');
            }

            // Alterna badge de Urgente
            const badgeUrgente = document.getElementById('badge-urgente');
            if (alertaUrgente) {
                badgeUrgente.classList.remove('hidden');
            } else {
                badgeUrgente.classList.add('hidden');
            }

            // 4. Troca de visibilidade dos contêineres principais
            document.getElementById('estado-vazio').classList.add('hidden');
            document.getElementById('estado-resultado').classList.remove('hidden');

        } catch (error) {
            console.error("Falha ao processar o formulário:", error);
            alert("Ocorreu um erro ao processar os dados. Verifique o console.");
        }
    });
});

/**
 * Atualiza o DOM com as recomendações processadas
 */
function exibirResultado(dados) {
    // Injetar dados nos campos básicos
    document.getElementById('res-nome').innerText = dados.nome;
    document.getElementById('res-valor-risco').innerText = formatadorMoeda.format(dados.valorRisco);
    document.getElementById('res-dias').innerText = `${dados.dias} dia(s)`;

    // Atualizar texto do desconto sugerido
    const txtDescontoElem = document.getElementById('txt-desconto');
    if (dados.desconto > 0) {
        const novoPreco = dados.precoAtual * (1 - dados.desconto / 100);
        txtDescontoElem.innerHTML = `Sugerir <strong>desconto de ${dados.desconto}%</strong>. De <span class="line-through text-slate-400">${formatadorMoeda.format(dados.precoAtual)}</span> por <strong class="text-emerald-700 font-bold">${formatadorMoeda.format(novoPreco)}</strong>.`;
    } else {
        txtDescontoElem.innerHTML = 'Manter preço original. Prazo de validade seguro.';
    }

    // Exibir/Esconder card de Combo
    const acaoComboElem = document.getElementById('acao-combo');
    if (dados.combo) {
        acaoComboElem.classList.remove('hidden');
        acaoComboElem.classList.add('flex');
    } else {
        acaoComboElem.classList.add('hidden');
        acaoComboElem.classList.remove('flex');
    }

    // Exibir/Esconder Tag de Alerta Urgente
    const badgeUrgente = document.getElementById('badge-urgente');
    if (dados.urgente) {
        badgeUrgente.classList.remove('hidden');
    } else {
        badgeUrgente.classList.add('hidden');
    }

    // Trocar a visibilidade das seções
    document.getElementById('estado-vazio').classList.add('hidden');
    document.getElementById('estado-resultado').classList.remove('hidden');
}