// My List Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    loadMyList();
    setupSortButtons();
    setupProfileDropdown();
});

function loadMyList() {
    const mylist = JSON.parse(localStorage.getItem('mylist')) || [];
    const grid = document.getElementById('mylistGrid');
    const emptyState = document.getElementById('emptyState');

    grid.innerHTML = '';

    if (mylist.length === 0) {
        emptyState.style.display = 'flex';
        return;
    }

    emptyState.style.display = 'none';

    mylist.forEach(item => {
        const listItem = document.createElement('div');
        listItem.className = 'mylist-item';
        listItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="mylist-item-overlay">
                <button onclick="playItem('${item.id}')">
                    <i class="fas fa-play"></i> Assistir
                </button>
                <button onclick="removeFromList('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        grid.appendChild(listItem);
    });
}

function setupSortButtons() {
    const sortButtons = document.querySelectorAll('.sort-btn');
    sortButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sortButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadMyList();
        });
    });
}

function playItem(itemId) {
    alert('Iniciando reprodução... ' + itemId);
}

function removeFromList(itemId) {
    const mylist = JSON.parse(localStorage.getItem('mylist')) || [];
    const filtered = mylist.filter(item => item.id !== itemId);
    localStorage.setItem('mylist', JSON.stringify(filtered));
    loadMyList();
}

function setupProfileDropdown() {
    const profileName = localStorage.getItem('perfilAtivoNome') || 'Perfil';
    const profileImage = localStorage.getItem('perfilAtivoImagem') || 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png';
    
    const profileNameEl = document.getElementById('profileName');
    const profileIconEl = document.getElementById('profileIcon');
    
    if (profileNameEl) profileNameEl.textContent = profileName;
    if (profileIconEl) profileIconEl.src = profileImage;
}

// Add to list function (called from other pages)
function addToList(item) {
    let mylist = JSON.parse(localStorage.getItem('mylist')) || [];
    
    // Check if already in list
    const exists = mylist.some(i => i.id === item.id);
    if (!exists) {
        mylist.push(item);
        localStorage.setItem('mylist', JSON.stringify(mylist));
        alert('Adicionado à sua lista!');
    }
}
