const estadoApp = {
    paginaAtual: 'inicio',
    carrinho: [],
    usuario: null
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    carregarDados();
    configurarNavegacao();
    configurarFormularioCadastro();
    carregarPaginaSalva(); // ⬅️ NOVO: Carrega última página
}

// Configura navegação entre páginas
function configurarNavegacao() {
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pagina = this.getAttribute('data-page');
            mudarPagina(pagina);
            
            // Atualiza estado ativo dos links
            links.forEach(l => l.classList.remove('ativo'));
            this.classList.add('ativo');
        });
    });
}

// Função principal de navegação CORRIGIDA
function mudarPagina(pagina) {
    console.log('📍 Navegando para:', pagina, '| Página atual:', estadoApp.paginaAtual);
    
    // Se já está na mesma página SPA, não faz nada
    const paginasSPA = ['inicio', 'produtos', 'cadastro', 'carrinho'];
    if (paginasSPA.includes(pagina) && pagina === estadoApp.paginaAtual) {
        console.log('✅ Já está na página:', pagina);
        return;
    }
    
    estadoApp.paginaAtual = pagina;
    
    // Sempre atualiza a visualização das seções
    gerenciarSecoes(pagina);
    
    // Decide a ação baseada na página
    switch(pagina) {
        case 'produtos':
            carregarProdutos();
            break;
            
        case 'carrinho':
            carregarCarrinho();
            break;
            
        case 'inicio':
            console.log('🔄 Inicializando página inicial...');
            // ⬇️⬇️⬇️ CORREÇÃO: Garante que o carrossel é carregado
            setTimeout(() => {
                const carrosselTrack = document.getElementById('carrosselTrack');
                if (carrosselTrack) {
                    console.log('🎠 Verificando carrossel...');
                    
                    // Se o carrossel está vazio, força uma reinicialização
                    if (carrosselTrack.children.length === 0) {
                        console.log('🔄 Reinicializando carrossel...');
                        // Recria a instância do carrossel
                        if (window.carrosselInstance) {
                            window.carrosselInstance.inicializar();
                        } else {
                            // Se não existe instância, cria uma nova
                            window.carrosselInstance = new Carrossel();
                        }
                    } else {
                        console.log('✅ Carrossel já está carregado');
                    }
                }
            }, 50);
            break;
            
        case 'cadastro':
            console.log('📝 Página de cadastro carregada');
            break;
            
        default:
            console.warn('⚠️ Página não reconhecida:', pagina);
    }
    
    // Salva a página atual
    salvarPaginaAtual();
}

// ⬇️⬇️⬇️ NOVAS FUNÇÕES PARA SALVAR PÁGINA
function salvarPaginaAtual() {
    localStorage.setItem('paginaAtualBobs', estadoApp.paginaAtual);
}

function carregarPaginaSalva() {
    const paginaSalva = localStorage.getItem('paginaAtualBobs');
    if (paginaSalva && paginaSalva !== 'inicio') {
        setTimeout(() => {
            mudarPagina(paginaSalva);
        }, 100);
    }
}

// Gerencia a visibilidade das seções
function gerenciarSecoes(pagina) {
    // Esconde todas as seções
    document.querySelectorAll('main section').forEach(sec => {
        sec.classList.add('secao-oculta');
        sec.classList.remove('secao-ativa');
    });
    
    // Mostra a seção ativa
    const secaoAtiva = document.getElementById(`secao-${pagina}`);
    if (secaoAtiva) {
        secaoAtiva.classList.remove('secao-oculta');
        secaoAtiva.classList.add('secao-ativa');
    }
}

// Configura o formulário de cadastro
function configurarFormularioCadastro() {
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', function(e) {
            e.preventDefault();
            processarCadastro();
        });
    }
}

// Processa o formulário de cadastro
function processarCadastro() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    
    // Validações básicas
    if (senha !== confirmarSenha) {
        mostrarMensagem('As senhas não coincidem!', 'erro');
        return;
    }
    
    if (senha.length < 6) {
        mostrarMensagem('A senha deve ter pelo menos 6 caracteres!', 'erro');
        return;
    }
    
    // Simula cadastro bem-sucedido
    estadoApp.usuario = { nome, email };
    localStorage.setItem('usuarioBobs', JSON.stringify(estadoApp.usuario));
    
    mostrarMensagem('Cadastro realizado com sucesso!', 'sucesso');
    document.getElementById('form-cadastro').reset();
    
    // Redireciona para a página inicial após 2 segundos
    setTimeout(() => {
        mudarPagina('inicio');
    }, 2000);
}

// ⬇️⬇️⬇️ FUNÇÕES DO CARRINHO - CORRIGIDAS

// Adiciona produto ao carrinho - CORRIGIDA
function adicionarAoCarrinho(produto) {
    // Verifica se há um tamanho selecionado no carrossel
    const cardElement = document.querySelector(`[data-product-id="${produto.id}"]`);
    let tamanhoSelecionado = null;
    
    if (cardElement && cardElement.dataset.tamanhoSelecionado) {
        tamanhoSelecionado = cardElement.dataset.tamanhoSelecionado;
    }
    
    const produtoComTamanho = {
        ...produto,
        tamanhoSelecionado: tamanhoSelecionado
    };
    
    // ⬇️⬇️⬇️ CORREÇÃO: Busca flexível por item
    const itemExistente = estadoApp.carrinho.find(item => {
        const mesmoId = item.id === produto.id;
        const mesmoTamanho = (item.tamanhoSelecionado === tamanhoSelecionado) || 
                            (!item.tamanhoSelecionado && !tamanhoSelecionado);
        return mesmoId && mesmoTamanho;
    });
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        estadoApp.carrinho.push({
            ...produtoComTamanho,
            quantidade: 1
        });
    }
    
    salvarCarrinho();
    
    if (tamanhoSelecionado) {
        mostrarMensagem(`${produto.titulo} (Tamanho: ${tamanhoSelecionado}) adicionado ao carrinho!`, 'sucesso');
    } else {
        mostrarMensagem(`${produto.titulo} adicionado ao carrinho!`, 'sucesso');
    }
    
    // Atualiza o carrinho se estiver na página do carrinho
    if (estadoApp.paginaAtual === 'carrinho') {
        carregarCarrinho();
    }
}

// Remove produto do carrinho - CORRIGIDA
function removerDoCarrinho(id, tamanho) {
    console.log('🚮 Removendo item - ID:', id, 'Tamanho:', tamanho);
    
    // ⬇️⬇️⬇️ CORREÇÃO: Normaliza o valor do tamanho
    const tamanhoNormalizado = (tamanho === 'undefined' || tamanho === 'null' || !tamanho) ? null : tamanho;
    
    estadoApp.carrinho = estadoApp.carrinho.filter(item => {
        const mesmoId = item.id === id;
        const mesmoTamanho = (item.tamanhoSelecionado === tamanhoNormalizado) || 
                            (!item.tamanhoSelecionado && !tamanhoNormalizado);
        return !(mesmoId && mesmoTamanho);
    });
    
    salvarCarrinho();
    carregarCarrinho();
    mostrarMensagem('Produto removido do carrinho!', 'sucesso');
}

// Atualiza quantidade - CORRIGIDA
function atualizarQuantidade(id, tamanho, novaQuantidade) {
    console.log('🔢 Atualizando quantidade - ID:', id, 'Tamanho:', tamanho, 'Nova Qtd:', novaQuantidade);
    
    // ⬇️⬇️⬇️ CORREÇÃO: Normaliza o valor do tamanho
    const tamanhoNormalizado = (tamanho === 'undefined' || tamanho === 'null' || !tamanho) ? null : tamanho;
    
    // Se quantidade for menor que 1, remove o item
    if (novaQuantidade < 1) {
        removerDoCarrinho(id, tamanhoNormalizado);
        return;
    }
    
    // ⬇️⬇️⬇️ CORREÇÃO: Busca flexível por item
    const item = estadoApp.carrinho.find(item => {
        const mesmoId = item.id === id;
        const mesmoTamanho = (item.tamanhoSelecionado === tamanhoNormalizado) || 
                            (!item.tamanhoSelecionado && !tamanhoNormalizado);
        return mesmoId && mesmoTamanho;
    });
    
    if (item) {
        item.quantidade = novaQuantidade;
        salvarCarrinho();
        carregarCarrinho();
        mostrarMensagem('Quantidade atualizada!', 'sucesso');
    } else {
        console.error('❌ Item não encontrado no carrinho - ID:', id, 'Tamanho:', tamanhoNormalizado);
        console.log('📦 Carrinho atual:', estadoApp.carrinho);
    }
}

// Carrega e exibe o carrinho - CORRIGIDA
function carregarCarrinho() {
    const vazio = document.getElementById('carrinho-vazio');
    const itens = document.getElementById('carrinho-itens');
    
    if (!vazio || !itens) {
        console.error('❌ Elementos do carrinho não encontrados!');
        return;
    }
    
    console.log('📦 Carrinho atual:', estadoApp.carrinho);
    
    // Se carrinho está vazio
    if (estadoApp.carrinho.length === 0) {
        vazio.style.display = 'block';
        itens.style.display = 'none';
        return;
    }
    
    // Se tem itens, mostra o carrinho
    vazio.style.display = 'none';
    itens.style.display = 'block';
    
    let total = 0;
    
    // Gera o HTML para cada item do carrinho
    itens.innerHTML = estadoApp.carrinho.map(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        
        // Info do tamanho (se existir)
        const tamanhoInfo = item.tamanhoSelecionado ? 
            `<br><small>Tamanho: ${item.tamanhoSelecionado}</small>` : '';
        
        // ⬇️⬇️⬇️ CORREÇÃO: Prepara os parâmetros corretamente
        const tamanhoParam = item.tamanhoSelecionado || '';
        
        return `
            <div class="carrinho-item" data-item-id="${item.id}" data-tamanho="${item.tamanhoSelecionado || ''}">
                <img src="${item.imagem}" alt="${item.titulo}" 
                     onerror="this.src='https://via.placeholder.com/80x80/3498db/ffffff?text=Produto'">
                <div class="carrinho-item-info">
                    <h4>${item.titulo}${tamanhoInfo}</h4>
                    <p class="preco">R$ ${item.preco.toFixed(2)}</p>
                </div>
                <div class="carrinho-item-controles">
                    <div class="quantidade-controle">
                        <button class="btn-quantidade" onclick="atualizarQuantidade(${item.id}, '${tamanhoParam}', ${item.quantidade - 1})">-</button>
                        <span class="quantidade-numero">${item.quantidade}</span>
                        <button class="btn-quantidade" onclick="atualizarQuantidade(${item.id}, '${tamanhoParam}', ${item.quantidade + 1})">+</button>
                    </div>
                    <p class="preco subtotal">R$ ${subtotal.toFixed(2)}</p>
                    <button class="remover-item" onclick="removerDoCarrinho(${item.id}, '${tamanhoParam}')">
                        🗑️ Remover
                    </button>
                </div>
            </div>
        `;
    }).join('') + `
        <div class="carrinho-total">
            <h3>Total: R$ ${total.toFixed(2)}</h3>
            <button class="btn-submit" onclick="finalizarCompra()">✅ Finalizar Compra</button>
        </div>
    `;
}

// Finaliza a compra
function finalizarCompra() {
    if (estadoApp.carrinho.length === 0) {
        mostrarMensagem('Seu carrinho está vazio!', 'erro');
        return;
    }
    
    const total = estadoApp.carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    mostrarMensagem(`🎉 Compra finalizada com sucesso! Total: R$ ${total.toFixed(2)}`, 'sucesso');
    
    // Limpa o carrinho
    estadoApp.carrinho = [];
    salvarCarrinho();
    carregarCarrinho();
    
    // Volta para a página inicial após 3 segundos
    setTimeout(() => {
        mudarPagina('inicio');
    }, 3000);
}

// Carrega dados do localStorage
function carregarDados() {
    const carrinhoSalvo = localStorage.getItem('carrinhoBobs');
    const usuarioSalvo = localStorage.getItem('usuarioBobs');
    
    if (carrinhoSalvo) {
        estadoApp.carrinho = JSON.parse(carrinhoSalvo);
    }
    
    if (usuarioSalvo) {
        estadoApp.usuario = JSON.parse(usuarioSalvo);
    }
}

// Salva carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem('carrinhoBobs', JSON.stringify(estadoApp.carrinho));
}

// Mostra mensagens para o usuário
function mostrarMensagem(texto, tipo = 'sucesso') {
    // Remove mensagens existentes
    const mensagensExistentes = document.querySelectorAll('.mensagem');
    mensagensExistentes.forEach(msg => msg.remove());
    
    const msg = document.createElement('div');
    msg.className = `mensagem ${tipo}`;
    msg.textContent = texto;
    
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.remove();
    }, 3000);
}

// ⬇️⬇️⬇️ FUNÇÃO PARA CARREGAR PRODUTOS (se não existir)
function carregarProdutos() {
    const gridProdutos = document.getElementById('grid-produtos');
    if (!gridProdutos) return;

    // Produtos exemplo - você pode substituir pelos seus
    const produtos = [
        {
            id: 1,
            imagem: "img/camPreta.jpg",
            titulo: "Camisa Preta",
            subtitulo: "Camisa casual preta",
            preco: 79.9,
            tamanhos: ["P", "M", "G", "GG"],
            tipoTamanho: "Tamanho"
        },
        {
            id: 2,
            imagem: "img/jaqueta.jpg",
            titulo: "Jaqueta",
            subtitulo: "Jaquetas de Inverno",
            preco: 200,
            tamanhos: ["P", "M", "G", "GG"],
            tipoTamanho: "Tamanho"
        }
        // Adicione mais produtos conforme necessário
    ];

    gridProdutos.innerHTML = produtos.map(produto => `
        <div class="card-produto" data-product-id="${produto.id}">
            <img src="${produto.imagem}" alt="${produto.titulo}" 
                 onerror="this.src='https://via.placeholder.com/300x300/3498db/ffffff?text=${encodeURIComponent(produto.titulo)}'">
            <div class="produto-info">
                <h3>${produto.titulo}</h3>
                <p class="subtitulo">${produto.subtitulo}</p>
                <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
                
                <div class="tamanhos">
                    <h4>${produto.tipoTamanho}:</h4>
                    <div class="tamanhos-lista">
                        ${produto.tamanhos.map(tamanho => 
                            `<button class="tamanho-btn" data-tamanho="${tamanho}">${tamanho}</button>`
                        ).join('')}
                    </div>
                </div>
                
                <button class="btn-adicionar" onclick="adicionarAoCarrinho(${JSON.stringify(produto).replace(/"/g, '&quot;')})">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `).join('');

    // Configura os botões de tamanho
    configurarBotoesTamanhoProdutos();
}

// ⬇️⬇️⬇️ FUNÇÃO PARA CONFIGURAR TAMANHOS NA PÁGINA DE PRODUTOS
function configurarBotoesTamanhoProdutos() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('tamanho-btn')) {
            const botao = e.target;
            const grupo = botao.parentElement;
            const card = botao.closest('.card-produto');
            
            // Remove seleção de outros botões no mesmo grupo
            grupo.querySelectorAll('.tamanho-btn').forEach(btn => {
                btn.classList.remove('ativo');
            });
            
            // Seleciona o botão clicado
            botao.classList.add('ativo');
            
            // Salva o tamanho selecionado no card
            const tamanhoSelecionado = botao.textContent;
            card.dataset.tamanhoSelecionado = tamanhoSelecionado;
            
            console.log(`✅ Tamanho ${tamanhoSelecionado} selecionado para ${card.querySelector('h3').textContent}`);
        }
    });
}

// Torna funções globais disponíveis
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.removerDoCarrinho = removerDoCarrinho;
window.atualizarQuantidade = atualizarQuantidade;
window.finalizarCompra = finalizarCompra;