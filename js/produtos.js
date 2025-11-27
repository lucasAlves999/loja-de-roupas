// NOVO produtos.js - COMPLETO
const todosProdutos = [
    {
        id: 1,
        imagem: "img/camPreta.jpg",
        titulo: "Camisa Preta",
        subtitulo: "Camisa casual preta",
        preco: 79.9,
        tamanhos: ["P", "M", "G", "GG"],
        tipoTamanho: "Tamanho",
        descricao: "Camiseta de alta qualidade com design exclusivo",
        categoria: "camisetas"
    },
    {
        id: 2,
        imagem: "img/jaqueta.jpg", 
        titulo: "Jaqueta",
        subtitulo: "Jaquetas de Inverno",
        preco: 200,
        tamanhos: ["P", "M", "G", "GG"],
        tipoTamanho: "Tamanho",
        descricao: "Jaqueta quente e estilosa para o inverno",
        categoria: "jaquetas"
    },
    {
        id: 3,
        imagem: "img/camBranca.jpg",
        titulo: "Camisa Branca",
        subtitulo: "Camisa casual branca", 
        preco: 79.9,
        tamanhos: ["P", "M", "G", "GG"],
        tipoTamanho: "Tamanho",
        descricao: "Camiseta de alta qualidade com design exclusivo",
        categoria: "camisetas"
    },
    {
        id: 4,
        imagem: "img/moletom.jpg",
        titulo: "Moletom",
        subtitulo: "Moletom Premium",
        preco: 159.90,
        tamanhos: ["P", "M", "G", "GG"],
        tipoTamanho: "Tamanho", 
        descricao: "Moletom ultra confortável para o dia a dia",
        categoria: "moletons"
    },
    {
        id: 5,
        imagem: "img/bermuda.jpg",
        titulo: "Bermuda",
        subtitulo: "Bermuda Casual",
        preco: 89.90,
        tamanhos: ["38", "40", "42", "44"],
        tipoTamanho: "Numeração",
        descricao: "Bermuda leve e confortável para o verão",
        categoria: "bermudas"
    },
    {
        id: 6, 
        imagem: "img/calca.jpg",
        titulo: "Calça Cargo",
        subtitulo: "Calça Cargo estilosa",
        preco: 120.90,
        tamanhos: ["38", "40", "42", "44"],
        tipoTamanho: "Numeração",
        descricao: "Calça leve e estilosa para varias ocasiões",
        categoria: "calcas"
    }
];

function carregarProdutos() {
    const gridProdutos = document.getElementById('grid-produtos');
    if (!gridProdutos) return;

    gridProdutos.innerHTML = todosProdutos.map(produto => `
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

    // ⬇️⬇️⬇️ CONFIGURA OS BOTÕES DE TAMANHO
    configurarBotoesTamanho();
}

function configurarBotoesTamanho() {
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
            
            console.log(`Tamanho ${tamanhoSelecionado} selecionado para ${card.querySelector('h3').textContent}`);
        }
    });
}

// ⬇️⬇️⬇️ NOVA FUNÇÃO para adicionar ao carrinho considerando tamanhos
function adicionarAoCarrinhoProdutos(produto) {
    const cardElement = document.querySelector(`.card-produto[data-product-id="${produto.id}"]`);
    let tamanhoSelecionado = null;
    
    if (cardElement && cardElement.dataset.tamanhoSelecionado) {
        tamanhoSelecionado = cardElement.dataset.tamanhoSelecionado;
    }
    
    const produtoComTamanho = {
        ...produto,
        tamanhoSelecionado: tamanhoSelecionado
    };
    
    // Chama a função global do main.js
    window.adicionarAoCarrinho(produtoComTamanho);
}

// Inicializa quando a página é carregada
document.addEventListener('DOMContentLoaded', function() {
    // A função carregarProdutos será chamada automaticamente quando navegar para a página de produtos
});