// Movie and series data
const contentData = {
    "Ficção Científica": [
        { id: 1, title: "O Poder do Hábito", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=450&fit=crop", rating: 8.5, genre: "Ficção Científica" },
        { id: 2, title: "Realm", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop", rating: 8.3, genre: "Ficção Científica" },
        { id: 3, title: "Galáxia", image: "https://images.unsplash.com/photo-1485579149c0-123123410c81?w=300&h=450&fit=crop", rating: 7.9, genre: "Ficção Científica" },
        { id: 4, title: "Cosmos", image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop", rating: 8.7, genre: "Ficção Científica" },
        { id: 5, title: "Futuro", image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop", rating: 8.1, genre: "Ficção Científica" },
        { id: 6, title: "Espaço Infinito", image: "https://images.unsplash.com/photo-1489599849228-ed4dc6900cd4?w=300&h=450&fit=crop", rating: 7.8, genre: "Ficção Científica" },
    ],
    "Drama": [
        { id: 7, title: "Noites de Neon", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop", rating: 7.8, genre: "Drama" },
        { id: 8, title: "Coração de Aço", image: "https://images.unsplash.com/photo-1489599849228-ed4dc6900cd4?w=300&h=450&fit=crop", rating: 7.9, genre: "Drama" },
        { id: 9, title: "Vidas Entrelaçadas", image: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=300&h=450&fit=crop", rating: 8.2, genre: "Drama" },
        { id: 10, title: "Refluxo", image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7a89?w=300&h=450&fit=crop", rating: 7.4, genre: "Drama" },
    ],
    "Ação": [
        { id: 11, title: "A Última Missão", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop", rating: 8.2, genre: "Ação" },
        { id: 12, title: "Batalha", image: "https://images.unsplash.com/photo-1533089860892-a7d316dd0615?w=300&h=450&fit=crop", rating: 8.0, genre: "Ação" },
        { id: 13, title: "Perseguição", image: "https://images.unsplash.com/photo-1485579149c0-123123410c81?w=300&h=450&fit=crop", rating: 7.6, genre: "Ação" },
        { id: 14, title: "Combate", image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop", rating: 7.9, genre: "Ação" },
    ],
    "Comédia": [
        { id: 15, title: "Risadas Sem Fim", image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7a89?w=300&h=450&fit=crop", rating: 7.2, genre: "Comédia" },
        { id: 16, title: "Gargalhadas", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop", rating: 7.5, genre: "Comédia" },
        { id: 17, title: "Hilariante", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=450&fit=crop", rating: 7.3, genre: "Comédia" },
    ],
    "Horror": [
        { id: 18, title: "Entre Sombras", image: "https://images.unsplash.com/photo-1533089860892-a7d316dd0615?w=300&h=450&fit=crop", rating: 7.5, genre: "Horror" },
        { id: 19, title: "Pesadelo", image: "https://images.unsplash.com/photo-1485579149c0-123123410c81?w=300&h=450&fit=crop", rating: 7.7, genre: "Horror" },
    ],
    "Documentário": [
        { id: 20, title: "Florestas Perdidas", image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop", rating: 8.7, genre: "Documentário" },
        { id: 21, title: "Natureza Selvagem", image: "https://images.unsplash.com/photo-1489599849228-ed4dc6900cd4?w=300&h=450&fit=crop", rating: 8.4, genre: "Documentário" },
    ],
    "Animação": [
        { id: 22, title: "Crianças do Universo", image: "https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=300&h=450&fit=crop", rating: 8.0, genre: "Animação" },
        { id: 23, title: "Aventura Mágica", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=450&fit=crop", rating: 8.2, genre: "Animação" },
    ],
    "Suspense": [
        { id: 24, title: "Segredo Obscuro", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop", rating: 8.3, genre: "Suspense" },
        { id: 25, title: "Mistério Profundo", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop", rating: 8.1, genre: "Suspense" },
    ]
};

// Load profile info on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProfileInfo();
    renderContent();
    setupNavbar();
    setupModal();
    setupSearch();
});

// Load profile info from localStorage
function loadProfileInfo() {
    const profileName = localStorage.getItem('perfilAtivoNome') || 'Perfil';
    const profileImage = localStorage.getItem('perfilAtivoImagem') || 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png';
    
    const profileNameEl = document.getElementById('profileName');
    const profileIconEl = document.getElementById('profileIcon');
    
    if (profileNameEl) profileNameEl.textContent = profileName;
    if (profileIconEl) profileIconEl.src = profileImage;
}

// Render all content sections
function renderContent() {
    const container = document.getElementById('main-content');
    if (!container) return;

    Object.entries(contentData).forEach(([category, items]) => {
        const section = createSliderSection(category, items);
        container.appendChild(section);
    });
}

// Create a slider section
function createSliderSection(title, items) {
    const section = document.createElement('section');
    section.className = 'slider-section';
    section.id = title.toLowerCase().replace(/\s+/g, '-');

    const titleEl = document.createElement('h2');
    titleEl.className = 'slider-title';
    titleEl.textContent = title;
    section.appendChild(titleEl);

    const row = document.createElement('div');
    row.className = 'movie-row';

    items.forEach(item => {
        const card = createMovieCard(item);
        row.appendChild(card);
    });

    section.appendChild(row);
    return section;
}

// Create a movie card
function createMovieCard(item) {
    const card = document.createElement('article');
    card.className = 'movie-card';
    card.setAttribute('data-id', item.id);
    card.setAttribute('data-title', item.title);

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title;
    img.loading = 'lazy';
    card.appendChild(img);

    const details = document.createElement('div');
    details.className = 'card-details';
    details.innerHTML = `
        <div class="details-buttons">
            <div>
                <button class="btn-icon btn-play-icon" title="Assistir" aria-label="Assistir ${item.title}">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div style="display: flex; gap: 8px;">
                <button class="btn-icon" title="Adicionar à lista">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="btn-icon" title="Favorito">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="btn-icon details-btn" title="Mais informações">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
        </div>
        <div class="details-info">
            <span class="match-score">${Math.round(item.rating * 10)}% Compatível</span>
            <span class="tag">${item.genre}</span>
        </div>
    `;
    card.appendChild(details);

    // Add click handler for details
    const detailsBtn = details.querySelector('.details-btn');
    if (detailsBtn) {
        detailsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showModal(item);
        });
    }

    card.addEventListener('click', () => {
        showModal(item);
    });

    return card;
}

// Show modal with content details
function showModal(item) {
    const modal = document.getElementById('contentModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <img src="${item.image}" alt="${item.title}" style="width: 100%; border-radius: 8px; margin-bottom: 20px;">
        <h2 class="modal-title">${item.title}</h2>
        <div class="modal-info">
            <span><strong>${Math.round(item.rating * 10)}%</strong> Compatível</span>
            <span><strong>${item.genre}</strong></span>
            <span>2024</span>
        </div>
        <p class="modal-synopsis">
            Uma produção envolvente que promete horas de diversão e emoção. 
            ${item.title} é uma obra que combina excelente roteiro, atuações memoráveis 
            e cinematografia de primeira qualidade. Perfeito para quem busca entretenimento de qualidade.
        </p>
        <div style="display: flex; gap: 10px;">
            <button class="btn btn-play">
                <i class="fas fa-play"></i> Assistir Agora
            </button>
            <button class="btn btn-info">
                <i class="fas fa-info-circle"></i> Mais Detalhes
            </button>
        </div>
    `;

    modal.classList.add('active');
}

// Setup modal close
function setupModal() {
    const modal = document.getElementById('contentModal');
    const closeBtn = modal.querySelector('.modal-close');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Setup navbar background on scroll
function setupNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchForm = document.querySelector('.search-form');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.movie-card');

        cards.forEach(card => {
            const title = card.getAttribute('data-title').toLowerCase();
            if (title.includes(query) || query === '') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Handle form submission for full search
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                // Navigate to search results page
                window.location.href = `../paginas/search-results.html?q=${encodeURIComponent(query)}`;
            }
        });
    }
}
