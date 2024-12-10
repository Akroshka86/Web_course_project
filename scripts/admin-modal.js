// Скрипт для модального окна администратора

// Логика управления модальным окном для входа и регистрации
function setupAuthModal() {
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const authModal = document.getElementById('auth-modal');
    const closeModal = document.querySelector('.close');
    const authForm = document.getElementById('auth-form');
    const toggleAuth = document.getElementById('toggle-auth');
    const authTitle = document.getElementById('auth-title');
    const authSwitchText = document.getElementById('auth-switch');

    // Открытие модального окна
    loginButton.addEventListener('click', () => {
        authModal.classList.remove('hidden');
    });

    // Закрытие модального окна
    closeModal.addEventListener('click', () => {
        authModal.classList.add('hidden');
        window.location.href = 'index.html';
    });

    // Логика выхода из системы
    logoutButton.addEventListener('click', () => {
        clearSession();
        window.location.href = 'index.html';
    });
}