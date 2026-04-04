// Search Results Page JavaScript

const allContent = [
    // Movies
    {
        id: 1,
        title: 'Inception',
        type: 'movie',
        year: 2010,
        rating: 8.8,
        image: 'https://images.unsplash.com/photo-1536440936146-a66fc5a8c3fb?w=200&h=300&fit=crop'
    },
    {
        id: 2,
        title: 'Tenet',
        type: 'movie',
        year: 2020,
        rating: 7.3,
        image: 'https://images.unsplash.com/photo-1502726299822-6f3ee058c6c9?w=200&h=300&fit=crop'
    },
    {
        id: 3,
        title: 'Interstellar',
        type: 'movie',
        year: 2014,
        rating: 8.7,
        image: 'https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=200&h=300&fit=crop'
    },
    {
        id: 4,
        title: 'The Dark Knight',
        type: 'movie',
        year: 2008,
        rating: 9.0,
        image: 'https://images.unsplash.com/photo-1533613220915-6f7ee359e0af?w=200&h=300&fit=crop'
    },
    {
        id: 5,
        title: 'Dune',
        type: 'movie',
        year: 2021,
        rating: 8.0,
        image: 'https://images.unsplash.com/photo-1518992028579-99f1e7f7e08f?w=200&h=300&fit=crop'
    },
    {
        id: 6,
        title: 'Avatar',
        type: 'movie',
        year: 2009,
        rating: 7.8,
        image: 'https://images.unsplash.com/photo-1479696574330-cd70f8e85e5f?w=200&h=300&fit=crop'
    },
    // Series
    {
        id: 7,
        title: 'Stranger Things',
        type: 'series',
        year: 2016,
        rating: 8.4,
        image: 'https://images.unsplash.com/photo-1516573398502-247d2c4186f7?w=200&h=300&fit=crop'
    },
    {
        id: 8,
        title: 'Breaking Bad',
        type: 'series',
        year: 2008,
        rating: 9.5,
        image: 'https://images.unsplash.com/photo-1531260594146-c8b4fec8c6e6?w=200&h=300&fit=crop'
    },
    {
        id: 9,
        title: 'The Crown',
        type: 'series',
        year: 2016,
        rating: 8.6,
        image: 'https://images.unsplash.com/photo-1514894694267-18bbc9dcf414?w=200&h=300&fit=crop'
    },
    {
        id: 10,
        title: 'Chernobyl',
        type: 'series',
        year: 2019,
        rating: 9.3,
        image: 'https://images.unsplash.com/photo-1541961017774-22949232552e?w=200&h=300&fit=crop'
    },
    {
        id: 11,
        title: 'The Office',
        type: 'series',
        year: 2005,
        rating: 9.0,
        image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&h=300&fit=crop'
    },
];

let currentResults = [];
let currentFilter = 'all';
let currentSort = 'relevance';

document.addEventListener('DOMContentLoaded', () => {
    setupSearchInput();
    setupFilterButtons();
    setupSortSelect();
    setupNavbar();
    setupProfileDropdown();

    // Get search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');

    if (query) {
        document.getElementById('searchInput').value = query;
        performSearch(query);
    }
});

function setupSearchInput() {
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        clearSearch.style.display = query ? 'block' : 'none';
        
        if (query) {
            performSearch(query);
        } else {
            showEmptyState();
        }
    });

    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
        clearSearch.style.display = 'none';
        showEmptyState();
    });

    // Enter key search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });
}

function performSearch(query) {
    // Show loading state
    document.getElementById('loadingState').style.display = 'flex';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('resultsGrid').innerHTML = '';

    // Simulate search delay
    setTimeout(() => {
        const query_lower = query.toLowerCase();
        currentResults = allContent.filter(item => {
            return item.title.toLowerCase().includes(query_lower);
        });

        // Apply current filter
        applyFilter();
        
        // Apply sort
        applySorting();

        document.getElementById('loadingState').style.display = 'none';

        if (currentResults.length === 0) {
            showEmptyState();
            document.getElementById('resultsText').textContent = `Nenhum resultado encontrado para "${query}"`;
        } else {
            displayResults(currentResults);
            document.getElementById('resultsText').textContent = `${currentResults.length} resultado${currentResults.length > 1 ? 's' : ''} encontrado${currentResults.length > 1 ? 's' : ''} para "${query}"`;
            document.getElementById('emptyState').style.display = 'none';
        }
    }, 300);
}

function setupFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            applyFilter();
        });
    });
}

function applyFilter() {
    let filtered = [...currentResults];

    if (currentFilter !== 'all') {
        filtered = filtered.filter(item => item.type === currentFilter);
    }

    if (filtered.length === 0) {
        showEmptyState();
    } else {
        displayResults(filtered);
    }

    applySorting();
}

function setupSortSelect() {
    const sortSelect = document.getElementById('sortBy');
    
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        applySorting();
    });
}

function applySorting() {
    const resultsGrid = document.getElementById('resultsGrid');
    const items = Array.from(resultsGrid.querySelectorAll('.result-item'));

    items.sort((a, b) => {
        const aData = a.dataset;
        const bData = b.dataset;

        switch (currentSort) {
            case 'rating':
                return parseFloat(bData.rating) - parseFloat(aData.rating);
            case 'year':
                return parseInt(bData.year) - parseInt(aData.year);
            case 'name':
                return aData.title.localeCompare(bData.title);
            case 'relevance':
            default:
                return 0;
        }
    });

    // Re-append sorted items
    items.forEach(item => resultsGrid.appendChild(item));
}

function displayResults(results) {
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = '';

    results.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.dataset.title = item.title;
        resultItem.dataset.rating = item.rating;
        resultItem.dataset.year = item.year;
        resultItem.dataset.type = item.type;
        resultItem.onclick = () => viewContent(item);

        resultItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="result-item-overlay">
                <div class="result-item-overlay-button">
                    <i class="fas fa-play"></i>
                </div>
                <div class="result-item-title">${item.title}</div>
                <div class="result-item-meta">
                    <span>${item.year}</span> • 
                    <span><i class="fas fa-star"></i> ${item.rating}</span>
                </div>
            </div>
        `;

        resultsGrid.appendChild(resultItem);
    });
}

function showEmptyState() {
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = '';
    document.getElementById('emptyState').style.display = 'flex';
}

function viewContent(item) {
    // In a real app, this would navigate to the movie/series detail page
    alert(`Abrindo: ${item.title}`);
    // window.location.href = `movie-detail.html?id=${item.id}`;
}

function setupNavbar() {
    const navbar = document.querySelector('.navbar-simple');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function setupProfileDropdown() {
    const profileImage = document.getElementById('profileImage');
    const profileDropImage = document.getElementById('profileDropImage');
    const profileDropName = document.getElementById('profileDropName');

    // Load profile from localStorage
    const perfilImage = localStorage.getItem('perfilAtivoImagem') || 'https://i.pravatar.cc/150?img=1';
    const perfilName = localStorage.getItem('perfilAtivoNome') || 'Usuário';

    profileImage.src = perfilImage;
    profileDropImage.src = perfilImage;
    profileDropName.textContent = perfilName;
}
