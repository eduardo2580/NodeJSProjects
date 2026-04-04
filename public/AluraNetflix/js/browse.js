// Browse Page JavaScript

// Sample content data
const allContent = [
    { id: 1, title: "O Poder do Hábito", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=450&fit=crop", type: "movie", trending: true },
    { id: 2, title: "Noites de Neon", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop", type: "series", trending: true },
    { id: 3, title: "A Última Missão", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop", type: "movie", trending: false },
    { id: 4, title: "Crianças do Universo", image: "https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=300&h=450&fit=crop", type: "series", trending: false },
    { id: 5, title: "Entre Sombras", image: "https://images.unsplash.com/photo-1533089860892-a7d316dd0615?w=300&h=450&fit=crop", type: "movie", trending: false },
    { id: 6, title: "Risadas Sem Fim", image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7a89?w=300&h=450&fit=crop", type: "series", trending: true },
    { id: 7, title: "Florestas Perdidas", image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop", type: "series", trending: false },
    { id: 8, title: "Coração de Aço", image: "https://images.unsplash.com/photo-1489599849228-ed4dc6900cd4?w=300&h=450&fit=crop", type: "movie", trending: false },
    { id: 9, title: "Vidas Entrelaçadas", image: "https://images.unsplash.com/photo-1485579149c0-123123410c81?w=300&h=450&fit=crop", type: "series", trending: true },
    { id: 10, title: "Segredo Obscuro", image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop", type: "movie", trending: false },
];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const grid = document.getElementById('gridContainer');

    // Set up filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            renderGrid(filter);
        });
    });

    // Initial render
    renderGrid('all');
    
    // Setup navbar
    setupNavbar();
    
    // Setup profile dropdown
    setupProfileDropdown();
});

function renderGrid(filter) {
    const grid = document.getElementById('gridContainer');
    grid.innerHTML = '';

    let filtered = allContent;

    if (filter === 'movies') {
        filtered = allContent.filter(item => item.type === 'movie');
    } else if (filter === 'series') {
        filtered = allContent.filter(item => item.type === 'series');
    } else if (filter === 'trending') {
        filtered = allContent.filter(item => item.trending);
    }

    filtered.forEach(item => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="grid-item-info">
                <p class="grid-item-title">${item.title}</p>
                <p class="grid-item-meta">${item.type === 'movie' ? 'Filme' : 'Série'}</p>
            </div>
        `;
        
        gridItem.addEventListener('click', () => {
            // Open modal with details
            alert('Detalhes de ' + item.title);
        });

        grid.appendChild(gridItem);
    });
}

function setupNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(20, 20, 20, 0.95)';
        } else {
            navbar.style.background = 'rgba(20, 20, 20, 0.8)';
        }
    });
}

function setupProfileDropdown() {
    const profileName = localStorage.getItem('perfilAtivoNome') || 'Perfil';
    const profileImage = localStorage.getItem('perfilAtivoImagem') || 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png';
    
    const profileNameEl = document.getElementById('profileName');
    const profileIconEl = document.getElementById('profileIcon');
    
    if (profileNameEl) profileNameEl.textContent = profileName;
    if (profileIconEl) profileIconEl.src = profileImage;
}
