const estadoApp = {
    paginaAtual: 'inicio',
    carrinho: [],
    usuario: null
};

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    carregarDados();
    configurarNavegacao();
    configurarFormularioCadastro();
    carregarPaginaSalva();
    inicializarSeletoresTamanho();
}

function configurarNavegacao() {
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pagina = this.getAttribute('data-page');
            mudarPagina(pagina);
            
            links.forEach(l => l.classList.remove('ativo'));
            this.classList.add('ativo');
        });
    });
}

function mudarPagina(pagina) {
    if (pagina === estadoApp.paginaAtual) return;
    
    estadoApp.paginaAtual = pagina;
    
    gerenciarSecoes(pagina);
    
    switch(pagina) {
        case 'produtos':
            carregarProdutos();
            break;
            
        case 'carrinho':
            carregarCarrinho();
            break;
            
        case 'inicio':
            setTimeout(() => {
                const carrosselTrack = document.getElementById('carrosselTrack');
                if (carrosselTrack && carrosselTrack.children.length === 0) {
                    if (window.carrosselInstance) {
                        window.carrosselInstance.inicializar();
                    }
                }
            }, 50);
            break;
    }
    
    salvarPaginaAtual();
}

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

function gerenciarSecoes(pagina) {
    document.querySelectorAll('main section').forEach(sec => {
        sec.classList.add('secao-oculta');
        sec.classList.remove('secao-ativa');
    });
    
    const secaoAtiva = document.getElementById(`secao-${pagina}`);
    if (secaoAtiva) {
        secaoAtiva.classList.remove('secao-oculta');
        secaoAtiva.classList.add('secao-ativa');
    }
}

function configurarFormularioCadastro() {
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', function(e) {
            e.preventDefault();
            processarCadastro();
        });
    }
}

function processarCadastro() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    
    if (senha !== confirmarSenha) {
        mostrarMensagem('As senhas não coincidem!', 'erro');
        return;
    }
    
    if (senha.length < 6) {
        mostrarMensagem('A senha deve ter pelo menos 6 caracteres!', 'erro');
        return;
    }
    
    estadoApp.usuario = { nome, email };
    localStorage.setItem('usuarioBobs', JSON.stringify(estadoApp.usuario));
    
    mostrarMensagem('Cadastro realizado com sucesso!', 'sucesso');
    document.getElementById('form-cadastro').reset();
    
    setTimeout(() => {
        mudarPagina('produtos');
    }, 2000);
}

function adicionarAoCarrinho(produto) {
    const cardElement = document.querySelector(`[data-product-id="${produto.id}"]`);
    let tamanhoSelecionado = null;
    
    if (cardElement && cardElement.dataset.tamanhoSelecionado) {
        tamanhoSelecionado = cardElement.dataset.tamanhoSelecionado;
    } else {
        const selectElement = cardElement ? cardElement.querySelector('select.tamanho-select') : null;
        if (selectElement) {
            tamanhoSelecionado = selectElement.value;
            if (cardElement) {
                cardElement.dataset.tamanhoSelecionado = tamanhoSelecionado;
            }
        }
    }
    
    const produtoComTamanho = {
        ...produto,
        tamanhoSelecionado: tamanhoSelecionado || 'Não especificado'
    };
    
    const itemExistente = estadoApp.carrinho.find(item => {
        const mesmoId = item.id === produto.id;
        const mesmoTamanho = item.tamanhoSelecionado === tamanhoSelecionado;
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
    
    atualizarContadorCarrinho();
    
    if (estadoApp.paginaAtual === 'carrinho') {
        carregarCarrinho();
    } else if (estadoApp.paginaAtual === 'inicio') {
        atualizarIconeCarrinho();
    }
}

function atualizarContadorCarrinho() {
    const contador = document.getElementById('carrinho-contador');
    if (contador) {
        const totalItens = estadoApp.carrinho.reduce((total, item) => total + item.quantidade, 0);
        contador.textContent = totalItens;
        contador.style.display = totalItens > 0 ? 'block' : 'none';
    }
}

function atualizarIconeCarrinho() {
    const carrinhoIcon = document.querySelector('.carrinho-icon');
    if (carrinhoIcon && estadoApp.carrinho.length > 0) {
        carrinhoIcon.classList.add('tem-itens');
    } else if (carrinhoIcon) {
        carrinhoIcon.classList.remove('tem-itens');
    }
}

function removerDoCarrinho(id, tamanho) {
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

function atualizarQuantidade(id, tamanho, novaQuantidade) {
    const tamanhoNormalizado = (tamanho === 'undefined' || tamanho === 'null' || !tamanho) ? null : tamanho;
    
    if (novaQuantidade < 1) {
        removerDoCarrinho(id, tamanhoNormalizado);
        return;
    }
    
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
    }
}

function carregarCarrinho() {
    const vazio = document.getElementById('carrinho-vazio');
    const itens = document.getElementById('carrinho-itens');
    
    if (!vazio || !itens) return;
    
    if (estadoApp.carrinho.length === 0) {
        vazio.style.display = 'block';
        itens.style.display = 'none';
        return;
    }
    
    vazio.style.display = 'none';
    itens.style.display = 'block';
    
    let total = 0;
    
    itens.innerHTML = estadoApp.carrinho.map(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        
        const tamanhoInfo = item.tamanhoSelecionado ? 
            `<br><small>Tamanho: ${item.tamanhoSelecionado}</small>` : '';
        
        const tamanhoParam = item.tamanhoSelecionado || '';
        
        return `
            <div class="carrinho-item" data-item-id="${item.id}" data-tamanho="${tamanhoParam}">
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

function finalizarCompra() {
    if (estadoApp.carrinho.length === 0) {
        mostrarMensagem('Seu carrinho está vazio!', 'erro');
        return;
    }
    
    const total = estadoApp.carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    mostrarMensagem(`🎉 Compra finalizada com sucesso! Total: R$ ${total.toFixed(2)}`, 'sucesso');
    
    estadoApp.carrinho = [];
    salvarCarrinho();
    carregarCarrinho();
    
    setTimeout(() => {
        mudarPagina('inicio');
    }, 3000);
}

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

function salvarCarrinho() {
    localStorage.setItem('carrinhoBobs', JSON.stringify(estadoApp.carrinho));
}

function mostrarMensagem(texto, tipo = 'sucesso') {
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

function carregarProdutos() {
    const gridProdutos = document.getElementById('grid-produtos');
    if (!gridProdutos) return;

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
                    <label>Tamanho:</label>
                    <select class="tamanho-select" data-product-id="${produto.id}">
                        <option value="P">P</option>
                        <option value="M" selected>M</option>
                        <option value="G">G</option>
                        <option value="GG">GG</option>
                    </select>
                </div>
                
                <button class="btn-adicionar" onclick="adicionarAoCarrinho(${JSON.stringify(produto).replace(/"/g, '&quot;')})">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `).join('');

    inicializarSeletoresTamanho();
}

function configurarBotoesTamanhoProdutos() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('tamanho-btn')) {
            const botao = e.target;
            const grupo = botao.parentElement;
            const card = botao.closest('.card-produto');
            
            grupo.querySelectorAll('.tamanho-btn').forEach(btn => {
                btn.classList.remove('ativo');
            });
            
            botao.classList.add('ativo');
            const tamanhoSelecionado = botao.textContent;
            card.dataset.tamanhoSelecionado = tamanhoSelecionado;
        }
    });
}

function inicializarSeletoresTamanho() {
    document.querySelectorAll('.tamanho-select').forEach(select => {
        const productId = select.getAttribute('data-product-id');
        if (productId) {
            const card = document.querySelector(`[data-product-id="${productId}"]`);
            if (card) {
                card.dataset.tamanhoSelecionado = select.value;
            }
        }
        
        select.addEventListener('change', function() {
            const productId = this.getAttribute('data-product-id');
            const card = document.querySelector(`[data-product-id="${productId}"]`);
            if (card) {
                card.dataset.tamanhoSelecionado = this.value;
            }
        });
    });
}

function atualizarTamanhoSelecionado(productId, tamanho) {
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    if (card) {
        card.dataset.tamanhoSelecionado = tamanho;
    }
}

window.adicionarAoCarrinho = adicionarAoCarrinho;
window.removerDoCarrinho = removerDoCarrinho;
window.atualizarQuantidade = atualizarQuantidade;
window.finalizarCompra = finalizarCompra;
window.atualizarTamanhoSelecionado = atualizarTamanhoSelecionado;