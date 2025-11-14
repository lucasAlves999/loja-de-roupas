class Carrossel {
    constructor() {
        this.carrosselTrack = document.getElementById('carrosselTrack');
        this.carrosselDots = document.getElementById('carrosselDots');
        this.cardsVisiveis = 3;
        this.cardAtual = 0;
        this.cards = [];
        this.cardWidth = 320; 
        
        this.inicializar();
    }
    
    inicializar() {
        this.carregarProdutos();
        this.criarIndicadores();
        this.configurarEventos();
        this.atualizarCarrossel();
        this.ajustarCardsVisiveis();
    }
    
    carregarProdutos() {
        this.cards = [
            {
                id: 1,
                imagem: "img/camPreta.jpg",
                titulo: "Camisa Preta",
                subtitulo: "Camisa casual preta",
                preco: 79.9,
                tamanhos: ["P", "M", "G"],
                tipoTamanho: "Tamanho",
                descricao: "Camiseta de alta qualidade com design exclusivo"
            },
            {
                id: 2,
                imagem: "img/jaqueta.jpg",
                titulo: "Jaqueta",
                subtitulo: "Jaquetas de Inverno",
                preco: 200,
                tamanhos: ["P", "M", "G"],
                tipoTamanho: "Tamanho",
                descricao: "Jaqueta quente e estilosa para o inverno"
            },
            {
                id: 3,
                imagem: "img/camBranca.jpg",
                titulo: "Camisa Branca",
                subtitulo: "Camisa casual branca",
                preco: 79.9,
                tamanhos: ["P", "M", "G"],
                tipoTamanho: "Tamanho",
                descricao: "Camiseta de alta qualidade com design exclusivo"
            },
            {
                id: 4,
                imagem: "img/moletom.jpg",
                titulo: "Moletom",
                subtitulo: "Moletom Premium", 
                preco: 159.90,
                tamanhos: ["P", "M", "G", "GG"],
                tipoTamanho: "Tamanho",
                descricao: "Moletom ultra confortável para o dia a dia"
            },
            {
                id: 5,
                imagem: "img/bermuda.jpg",
                titulo: "Bermuda",
                subtitulo: "Bermuda Casual",
                preco: 89.90,
                tamanhos: ["38", "40", "42", "44"],
                tipoTamanho: "Numeração",
                descricao: "Bermuda leve e confortável para o verão"
            },
            {
                id: 6,
                imagem: "img/calca.jpg",
                titulo: "Calça Cargo",
                subtitulo: "Calça Cargo estilosa",
                preco: 120.90,
                tamanhos: ["38", "40", "42", "44"],
                tipoTamanho: "Numeração", 
                descricao: "Calça leve e estilosa para varias ocasiões"
            }
        ];
        
        this.renderizarCards();
    }
    
    renderizarCards() {
        this.carrosselTrack.innerHTML = this.cards.map(card => `
            <div class="carrossel-card">
                <img src="${card.imagem}" alt="${card.titulo}">
                <div class="carrossel-card-content">
                    <h3>${card.titulo}</h3>
                    <p class="subtitulo">${card.subtitulo}</p>
                    <p class="preco">R$ ${card.preco.toFixed(2)}</p>
                    
                    <div class="tamanhos">
                        <h4>${card.tipoTamanho}:</h4>
                        <div class="tamanhos-lista">
                            ${card.tamanhos.map(tamanho => 
                                `<button class="tamanho-btn" data-tamanho="${tamanho}">${tamanho}</button>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <button class="btn-adicionar" onclick="adicionarAoCarrinho(${JSON.stringify(card).replace(/"/g, '&quot;')})">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    criarIndicadores() {
        const totalSlides = Math.ceil(this.cards.length / this.cardsVisiveis);
        this.carrosselDots.innerHTML = Array.from({length: totalSlides}, (_, i) => 
            `<div class="carrossel-dot ${i === 0 ? 'ativo' : ''}" data-slide="${i}"></div>`
        ).join('');
    }
    
    configurarEventos() {
        const btnPrev = document.querySelector('.carrossel-btn-prev');
        const btnNext = document.querySelector('.carrossel-btn-next');
        
        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                this.proximoCard(-1);
            });
        }
        
        if (btnNext) {
            btnNext.addEventListener('click', () => {
                this.proximoCard(1);
            });
        }
        
        this.carrosselDots.addEventListener('click', (e) => {
            if (e.target.classList.contains('carrossel-dot')) {
                this.irParaSlide(parseInt(e.target.dataset.slide));
            }
        });
        
        this.carrosselTrack.addEventListener('click', (e) => {
            if (e.target.classList.contains('tamanho-btn')) {
                this.selecionarTamanho(e.target);
            }
        });
        
        window.addEventListener('resize', () => {
            this.ajustarCardsVisiveis();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.proximoCard(-1);
            } else if (e.key === 'ArrowRight') {
                this.proximoCard(1);
            }
        });
    }
    
    proximoCard(direcao) {
        const totalSlides = Math.ceil(this.cards.length / this.cardsVisiveis);
        this.cardAtual = (this.cardAtual + direcao + totalSlides) % totalSlides;
        this.atualizarCarrossel();
    }
    
    irParaSlide(slideIndex) {
        const totalSlides = Math.ceil(this.cards.length / this.cardsVisiveis);
        if (slideIndex >= 0 && slideIndex < totalSlides) {
            this.cardAtual = slideIndex;
            this.atualizarCarrossel();
        }
    }
    
    atualizarCarrossel() {
        const translateX = -this.cardAtual * this.cardsVisiveis * this.cardWidth;
        this.carrosselTrack.style.transform = `translateX(${translateX}px)`;
        
        document.querySelectorAll('.carrossel-dot').forEach((dot, index) => {
            dot.classList.toggle('ativo', index === this.cardAtual);
        });
    }
    
    selecionarTamanho(botao) {
        const grupo = botao.parentElement;
        grupo.querySelectorAll('.tamanho-btn').forEach(btn => {
            btn.classList.remove('ativo');
        });
        botao.classList.add('ativo');
    }
    
    ajustarCardsVisiveis() {
        if (window.innerWidth < 768) {
            this.cardsVisiveis = 1;
            this.cardWidth = 270;
        } else if (window.innerWidth < 1024) {
            this.cardsVisiveis = 2;
            this.cardWidth = 320;
        } else {
            this.cardsVisiveis = 3;
            this.cardWidth = 320;
        }
        
        this.criarIndicadores();
        this.cardAtual = 0;
        this.atualizarCarrossel();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new Carrossel();
});