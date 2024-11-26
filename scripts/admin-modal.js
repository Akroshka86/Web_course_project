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

    let isLoginMode = true;

    // Открытие модального окна
    loginButton.addEventListener('click', () => {
        authModal.classList.remove('hidden');
    });

    // Закрытие модального окна
    closeModal.addEventListener('click', () => {
        authModal.classList.add('hidden');
        window.location.href = 'index.html';
    });

    // Отправка формы
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (isLoginMode) {
            if (login(username, password)) {
                authModal.classList.add('hidden');

                // Обновляем интерфейс после входа
                updateUI(); 
            } else {
            }
        } else {
            if (register(username, password)) {
                isLoginMode = true;
                authTitle.textContent = 'Вход';
                authForm.querySelector('button').textContent = 'Войти';
            } else {
            }
        }
    });

    // Логика выхода из системы
    logoutButton.addEventListener('click', () => {
        clearSession();
        window.location.href = 'index.html';
    });
}