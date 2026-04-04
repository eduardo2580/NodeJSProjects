// Help Center JavaScript

document.addEventListener('DOMContentLoaded', () => {
    setupSearch();
    setupFAQAccordion();
});

function setupFAQAccordion() {
    const questions = document.querySelectorAll('.faq-question');

    questions.forEach(question => {
        question.addEventListener('click', () => {
            toggleFAQ(question);
        });
    });
}

function toggleFAQ(question) {
    const answer = question.nextElementSibling;
    const chevron = question.querySelector('.chevron');
    const isOpen = answer.style.display === 'block';

    answer.style.display = isOpen ? 'none' : 'block';
    chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
}

function setupSearch() {
    const searchBox = document.getElementById('helpSearch');
    if (!searchBox) return;

    searchBox.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        searchFAQ(query);
    });
}

function searchFAQ(query) {
    const questions = document.querySelectorAll('.faq-question');
    const categories = document.querySelectorAll('.faq-category');

    questions.forEach(question => {
        const text = question.textContent.toLowerCase();
        const answer = question.nextElementSibling.textContent.toLowerCase();
        const matches = text.includes(query) || answer.includes(query);

        question.style.display = matches || query === '' ? 'block' : 'none';
        if (!matches && query !== '') {
            const answer = question.nextElementSibling;
            answer.style.display = 'none';
        }
    });

    categories.forEach(category => {
        const visibleQuestions = category.querySelectorAll('.faq-question:not([style*="display: none"])');
        category.style.display = visibleQuestions.length > 0 || query === '' ? 'block' : 'none';
    });
}

function contactSupport() {
    alert('Entrar em contato com suporte - redirecionando para formulário de contato');
    // Em uma aplicação real, isso abriria um formulário ou chat de suporte
}

function expandTopic(topic) {
    const categories = document.querySelectorAll('.faq-category');
    
    categories.forEach(category => {
        const title = category.querySelector('h3').textContent.toLowerCase();
        if (title.includes(topic.toLowerCase())) {
            const questions = category.querySelectorAll('.faq-question');
            questions.forEach(question => {
                const answer = question.nextElementSibling;
                const chevron = question.querySelector('.chevron');
                answer.style.display = 'block';
                chevron.style.transform = 'rotate(180deg)';
            });
        }
    });
}

function collapseAll() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(question => {
        const answer = question.nextElementSibling;
        const chevron = question.querySelector('.chevron');
        answer.style.display = 'none';
        chevron.style.transform = 'rotate(0deg)';
    });
}
