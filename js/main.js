const estadoApp = {
    paginaAtual: 'inicio',
    carrinho: []
};

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    carregarDados();
    configurarNavegacao();
}

function configurarNavegacao() {
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pagina = this.getAttribute('data-page');
            mudarPagina(pagina);
        });
    });
}

function mudarPagina(pagina) {
    estadoApp.paginaAtual = pagina;
    
    gerenciarSecoes(pagina);
    
    if (pagina === 'carrinho') {
        window.location.href = 'carrinho.html';
    } else if (pagina === 'cadastro') {
        window.location.href = 'cadastro.html';
    } else if (pagina === 'produtos') {
        carregarProdutos();
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

function adicionarAoCarrinho(produto) {
    const itemExistente = estadoApp.carrinho.find(item => item.id === produto.id);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        estadoApp.carrinho.push({
            ...produto,
            quantidade: 1
        });
    }
    
    salvarCarrinho();
    mostrarMensagem('Produto adicionado ao carrinho!');
}

function carregarProdutos() {
    // Pode ser implementado depois
}

function carregarDados() {
    const carrinhoSalvo = localStorage.getItem('carrinhoBobs');
    if (carrinhoSalvo) {
        estadoApp.carrinho = JSON.parse(carrinhoSalvo);
    }
}

function salvarCarrinho() {
    localStorage.setItem('carrinhoBobs', JSON.stringify(estadoApp.carrinho));
}

function mostrarMensagem(texto) {
    const msg = document.createElement('div');
    msg.textContent = texto;
    msg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--cor-secundaria);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
    `;
    
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.remove();
    }, 3000);
}

window.adicionarAoCarrinho = adicionarAoCarrinho;