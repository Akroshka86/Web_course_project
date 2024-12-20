// Функция срабатывает после загрузки страницы (HTML, CSS, JS)
window.onload = () => {

    // Вся логика модального окна
    setupAuthModal();

    // Обновляем интерфейс страницы в зависимости от регистрации пользователя
    updateUI();

    // Отображаем новости при загрузке страницы
    displayNews();

    // Добавляем обработчик для кнопки создания новости
    const createNewsButton = document.getElementById('create-news-button');
    if (createNewsButton) {

        // При нажатии на кнопку перенаправляет пользователя на страницу создания новости
        createNewsButton.addEventListener('click', () => {
            window.location.href = 'create-news.html';
        });
    }

    // Обработчик для кнопки "Мои сообщения"
    const myNewsButton = document.getElementById('my-news-button');
    const currentUser = loadSession();
    if (myNewsButton) {
        myNewsButton.addEventListener('click', () => {
            window.location.href = `user-messages.html`;
        });
    }


    // Добавляем обработчик для поля поиска
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            displayNews(searchTerm); // Отображаем новости с учетом фильтра
        });
    }

    // Обработчик для кнопки "Администратор"
    const adminButton = document.getElementById('admin-button');
    if (adminButton) {
        adminButton.addEventListener('click', () => {
            window.location.href = `admin-page.html`;
        });
    }

    const userActionsButton = document.getElementById('user-actions-btn');
    if (userActionsButton) {
        userActionsButton.addEventListener('click', () => {
            window.location.href = `log-page.html`;
        });
    }

    editButton.addEventListener('click', () => {
        window.location.href = `create-news.html?edit=${index}`;
    });
};


function updateUI() {
    const currentUser = loadSession();
    if (isAuthenticated()) {
        document.getElementById('login-button').classList.add('hidden');
        document.getElementById('logout-button').classList.remove('hidden');
        // Показываем кнопку создания новости
        document.getElementById('create-news-section').classList.remove('hidden');
        document.getElementById('my-news-section').classList.remove('hidden'); // Показываем кнопку "Мои сообщения"
        if (currentUser && currentUser.role === 'admin'){
            document.getElementById('admin-section').classList.remove('hidden');
            document.getElementById('user-actions-section').classList.remove('hidden');
        }
    } else {
        document.getElementById('login-button').classList.remove('hidden');
        document.getElementById('logout-button').classList.add('hidden');
        // Скрываем кнопку создания новости
        document.getElementById('create-news-section').classList.add('hidden');
        document.getElementById('my-news-section').classList.add('hidden'); // Скрываем кнопку "Мои сообщения"
    }
    displayNews(); // Отображаем новости независимо от состояния авторизации
}