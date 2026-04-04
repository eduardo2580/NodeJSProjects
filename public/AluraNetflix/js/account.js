// Account Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    loadAccountInfo();
    setupModals();
});

function loadAccountInfo() {
    const email = localStorage.getItem('userEmail') || 'usuario@netflix.com';
    document.getElementById('accountEmail').textContent = email;
    document.getElementById('userEmail').textContent = email;
}

function setupModals() {
    const plansModal = document.getElementById('plansModal');
    const passwordModal = document.getElementById('passwordModal');

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === plansModal) closePlansModal();
        if (e.target === passwordModal) closePasswordModal();
    });
}

function changePlan() {
    const modal = document.getElementById('plansModal');
    modal.style.display = 'flex';
}

function closePlansModal() {
    const modal = document.getElementById('plansModal');
    modal.style.display = 'none';
}

function selectPlan(planType) {
    const planNames = {
        'ads': 'Padrão com Anúncios',
        'standard': 'Padrão',
        'premium': 'Premium'
    };

    alert(`Você escolheu o plano ${planNames[planType]}. Processando...`);
    closePlansModal();
}

function addProfile() {
    alert('Adicionar novo perfil - em desenvolvimento');
}

function changePassword() {
    const modal = document.getElementById('passwordModal');
    modal.style.display = 'flex';
}

function closePasswordModal() {
    const modal = document.getElementById('passwordModal');
    modal.style.display = 'none';
}

function savePassword() {
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!oldPassword || !newPassword || !confirmPassword) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('As senhas não correspondem');
        return;
    }

    alert('Senha alterada com sucesso!');
    closePasswordModal();
}

function updatePayment() {
    alert('Atualizar forma de pagamento - em desenvolvimento');
}

function enable2FA() {
    alert('Autenticação de dois fatores - em desenvolvimento');
}

function revokeDevice(button) {
    const deviceItem = button.closest('.device-item');
    const deviceName = deviceItem.querySelector('.device-name').textContent;
    
    if (confirm(`Desconectar de ${deviceName}?`)) {
        deviceItem.remove();
        alert('Dispositivo desconectado com sucesso!');
    }
}

function signOutAll() {
    if (confirm('Desconectar de todos os dispositivos?')) {
        const devices = document.querySelectorAll('.device-item');
        devices.forEach(device => device.remove());
        alert('Desconectado de todos os dispositivos!');
    }
}

function deleteAccount() {
    if (confirm('AVISO: Esta ação é irreversível! Deseja realmente deletar sua conta?')) {
        if (confirm('Tem certeza? Todos os seus dados serão perdidos!')) {
            alert('Conta deletada. Redirecionando...');
            window.location.href = '../index.html';
        }
    }
}
