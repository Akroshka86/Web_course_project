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
    });

    // Переключение между входом и регистрацией
    toggleAuth.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        authTitle.textContent = isLoginMode ? 'Вход' : 'Регистрация';
        authForm.querySelector('button').textContent = isLoginMode ? 'Войти' : 'Зарегистрироваться';
        authSwitchText.innerHTML = isLoginMode ? 'Нет аккаунта? <a href="#" id="toggle-auth">Зарегистрироваться</a>' : 'Есть аккаунт? <a href="#" id="toggle-auth">Войти</a>';
    });

    // Отправка формы
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (isLoginMode) {
            if (login(username, password)) {
                alert('Успешный вход!');
                authModal.classList.add('hidden');
                updateUI(); // Обновляем интерфейс после входа
            } else {
                alert('Ошибка входа.');
            }
        } else {
            if (register(username, password)) {
                alert('Регистрация успешна. Теперь войдите.');
                isLoginMode = true;
                authTitle.textContent = 'Вход';
                authForm.querySelector('button').textContent = 'Войти';
            } else {
                alert('Ошибка регистрации.');
            }
        }
    });

    // Логика выхода из системы
    logoutButton.addEventListener('click', () => {
        clearSession();
        alert('Вы вышли из системы.');
        window.location.href = 'index.html';  // Перенаправляем на главную страницу
    });
}