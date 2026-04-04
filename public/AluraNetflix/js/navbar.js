// Shared Navbar JavaScript - Used across all pages

document.addEventListener('DOMContentLoaded', () => {
    setupNavbar();
    setupProfileDropdown();
});

function setupNavbar() {
    const navbar = document.querySelector('.navbar-simple');

    if (!navbar) return;

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
    
    if (!profileImage) return;

    const profileDropImage = document.getElementById('profileDropImage');
    const profileDropName = document.getElementById('profileDropName');

    // Load profile from localStorage
    const perfilImage = localStorage.getItem('perfilAtivoImagem') || 'https://i.pravatar.cc/150?img=1';
    const perfilName = localStorage.getItem('perfilAtivoNome') || 'Usuário';

    profileImage.src = perfilImage;
    if (profileDropImage) profileDropImage.src = perfilImage;
    if (profileDropName) profileDropName.textContent = perfilName;

    profileImage.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.querySelector('.dropdown-menu');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    });

    document.addEventListener('click', () => {
        const dropdown = document.querySelector('.dropdown-menu');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    });
}
