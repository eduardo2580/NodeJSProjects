// Movie Detail Page JavaScript

const movieData = {
    // Sample movie data - in a real app, this would come from an API
    featured: {
        id: 1,
        title: 'Inception',
        year: 2010,
        rating: 8.8,
        badge: 'Clássico',
        duration: '2h 28min',
        genres: 'Ficção Científica, Suspense, Ação',
        classification: '12+',
        production: 'Warner Bros, Legendary Pictures',
        synopsis: 'Um ladrão que especialista em roubar segredos corporativos através do uso de tecnologia de sonho-compartilhado recebe uma tarefa inversa: plantar uma ideia na mente de um CEO em vez de roubar uma. Um filme cerebral e visualmente impressionante.',
        cast: [
            { name: 'Leonardo DiCaprio', character: 'Cobb', image: 'https://i.pravatar.cc/150?img=20' },
            { name: 'Ellen Page', character: 'Ariadne', image: 'https://i.pravatar.cc/150?img=21' },
            { name: 'Marion Cotillard', character: 'Mal', image: 'https://i.pravatar.cc/150?img=22' }
        ],
        director: 'Christopher Nolan',
        writer: 'Christopher Nolan',
        producer: 'Emma Thomas, Christopher Nolan',
        languages: 'Inglês, Português, Espanhol, Francês',
        subtitles: 'Português, Inglês, Espanhol, Francês, Italiano, Alemão',
        quality: '4K Ultra HD',
        audio: 'Dolby Atmos, Surround 5.1',
        backgroundImage: 'https://images.unsplash.com/photo-1536440936146-a66fc5a8c3fb?w=1280&h=720&fit=crop'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadMovieDetails();
    setupNavbar();
    setupProfileDropdown();
    setupActions();
    loadSimilarContent();
});

function loadMovieDetails() {
    const movie = movieData.featured;

    // Set hero background
    const heroSection = document.getElementById('movieHero');
    heroSection.style.backgroundImage = `url(${movie.backgroundImage})`;

    // Update all details
    document.getElementById('movieTitle').textContent = movie.title;
    document.getElementById('movieYear').textContent = movie.year;
    document.getElementById('movieRating').innerHTML = `<i class="fas fa-star"></i> ${movie.rating}/10`;
    document.getElementById('movieBadge').textContent = movie.badge;

    document.getElementById('duration').textContent = movie.duration;
    document.getElementById('genres').textContent = movie.genres;
    document.getElementById('classification').textContent = movie.classification;
    document.getElementById('production').textContent = movie.production;

    document.getElementById('synopsis').textContent = movie.synopsis;

    // Load cast
    const castList = document.getElementById('castList');
    castList.innerHTML = movie.cast.map(member => `
        <div class="cast-item">
            <img src="${member.image}" alt="${member.name}">
            <div class="cast-item-info">
                <div class="cast-item-name">${member.name}</div>
                <div class="cast-item-character">${member.character}</div>
            </div>
        </div>
    `).join('');

    // Load crew
    document.getElementById('director').textContent = movie.director;
    document.getElementById('writer').textContent = movie.writer;
    document.getElementById('producer').textContent = movie.producer;

    // Load additional info
    document.getElementById('languages').textContent = movie.languages;
    document.getElementById('subtitles').textContent = movie.subtitles;
    document.getElementById('quality').textContent = movie.quality;
    document.getElementById('audio').textContent = movie.audio;

    // Update big rating
    document.getElementById('bigRating').textContent = movie.rating;
}

function setupActions() {
    document.getElementById('playBtn').addEventListener('click', playMovie);
    document.getElementById('addListBtn').addEventListener('click', toggleMyList);
    document.querySelector('.btn-share').addEventListener('click', shareMovie);
}

function playMovie() {
    // In a real app, this would navigate to a video player page
    const movieTitle = document.getElementById('movieTitle').textContent;
    alert(`Reproduzindo: ${movieTitle}`);
    // window.location.href = `../paginas/player.html?movieId=1`;
}

function toggleMyList() {
    const btn = document.getElementById('addListBtn');
    const movieTitle = document.getElementById('movieTitle').textContent;

    // Get current list from localStorage
    let myList = JSON.parse(localStorage.getItem('mylist') || '[]');

    // Check if already in list
    const isInList = myList.some(item => item.title === movieTitle);

    if (isInList) {
        myList = myList.filter(item => item.title !== movieTitle);
        btn.innerHTML = '<i class="fas fa-plus"></i> Minha Lista';
        alert(`${movieTitle} removido da sua lista`);
    } else {
        const movieData = {
            id: 1,
            title: movieTitle,
            image: movieData.featured.backgroundImage,
            rating: parseFloat(document.getElementById('movieRating').textContent.split(' ')[1])
        };
        myList.push(movieData);
        btn.innerHTML = '<i class="fas fa-check"></i> Na Minha Lista';
        alert(`${movieTitle} adicionado à sua lista`);
    }

    localStorage.setItem('mylist', JSON.stringify(myList));
}

function shareMovie() {
    const movieTitle = document.getElementById('movieTitle').textContent;
    const text = `Confira ${movieTitle} na Netflix!`;

    if (navigator.share) {
        navigator.share({
            title: 'Netflix',
            text: text,
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const url = encodeURIComponent(window.location.href);
        const encodedText = encodeURIComponent(text);
        alert(`Compartilhado: ${text}\n\nURL: ${window.location.href}`);
    }
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

    profileImage.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.querySelector('.dropdown-menu');
        dropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
        const dropdown = document.querySelector('.dropdown-menu');
        dropdown.classList.remove('active');
    });
}

function loadSimilarContent() {
    const similarItems = [
        {
            title: 'The Matrix',
            image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=200&h=300&fit=crop'
        },
        {
            title: 'Tenet',
            image: 'https://images.unsplash.com/photo-1502726299822-6f3ee058c6c9?w=200&h=300&fit=crop'
        },
        {
            title: 'Interstellar',
            image: 'https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=200&h=300&fit=crop'
        },
        {
            title: 'The Dark Knight',
            image: 'https://images.unsplash.com/photo-1533613220915-6f7ee359e0af?w=200&h=300&fit=crop'
        },
        {
            title: 'Dune',
            image: 'https://images.unsplash.com/photo-1518992028579-99f1e7f7e08f?w=200&h=300&fit=crop'
        },
        {
            title: 'Avatar',
            image: 'https://images.unsplash.com/photo-1479696574330-cd70f8e85e5f?w=200&h=300&fit=crop'
        }
    ];

    const similarGrid = document.getElementById('similarGrid');
    similarGrid.innerHTML = similarItems.map(item => `
        <div class="similar-item" onclick="viewMovie('${item.title}')">
            <img src="${item.image}" alt="${item.title}">
            <div class="similar-item-overlay">
                <i class="fas fa-play"></i>
            </div>
        </div>
    `).join('');
}

function viewMovie(title) {
    alert(`Abrindo: ${title}`);
    // In a real app, this would navigate to the movie detail page
    // window.location.href = `?movieId=${id}`;
}
