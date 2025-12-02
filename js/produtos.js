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
        <div class="card-produto" data-product-id="${produto.id}" data-tamanho-selecionado="M">
            <img src="${produto.imagem}" alt="${produto.titulo}" 
                 onerror="this.src='https://via.placeholder.com/300x300/3498db/ffffff?text=${encodeURIComponent(produto.titulo)}'">
            <div class="produto-info">
                <h3>${produto.titulo}</h3>
                <p class="subtitulo">${produto.subtitulo}</p>
                <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
                
                <div class="tamanhos">
                    <label for="tamanho-produto-${produto.id}">${produto.tipoTamanho}:</label>
                    <select id="tamanho-produto-${produto.id}" class="tamanho-select" 
                            onchange="atualizarTamanhoSelecionado(${produto.id}, this.value)">
                        ${produto.tamanhos.map(tamanho => 
                            `<option value="${tamanho}" ${tamanho === 'M' ? 'selected' : ''}>${tamanho}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <button class="btn-adicionar" 
                        onclick="adicionarAoCarrinho(${JSON.stringify(produto).replace(/"/g, '&quot;')})">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `).join('');

    // ⬇️⬇️⬇️ CONFIGURA OS SELECTS DE TAMANHO
    configurarSelectsTamanho();
}

function configurarSelectsTamanho() {
    document.querySelectorAll('.tamanho-select').forEach(select => {
        const productId = select.id.replace('tamanho-produto-', '');
        const card = document.querySelector(`[data-product-id="${productId}"]`);
        
        if (card) {
            card.dataset.tamanhoSelecionado = select.value;
        }
    });
}

function atualizarTamanhoSelecionado(productId, tamanho) {
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    if (card) {
        card.dataset.tamanhoSelecionado = tamanho;
        console.log(`Tamanho atualizado: ${tamanho} para produto ${productId}`);
    }
}

// Inicializa quando a página é carregada
document.addEventListener('DOMContentLoaded', function() {
    // Carrega produtos se estiver na página de produtos
    if (document.getElementById('grid-produtos')) {
        carregarProdutos();
    }
});

// Torna funções disponíveis globalmente
window.carregarProdutos = carregarProdutos;
window.atualizarTamanhoSelecionado = atualizarTamanhoSelecionado;