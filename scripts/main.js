// Функция срабатывает после загрузки страницы
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



    // Добавляем обработчик для поля поиска
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            displayNews(searchTerm); // Отображаем новости с учетом фильтра
        });
    }
};


function updateUI() {
    if (isAuthenticated()) {
        document.getElementById('login-button').classList.add('hidden');
        document.getElementById('logout-button').classList.remove('hidden');
        // Показываем кнопку создания новости
        document.getElementById('create-news-section').classList.remove('hidden');
    } else {
        document.getElementById('login-button').classList.remove('hidden');
        document.getElementById('logout-button').classList.add('hidden');
        // Скрываем кнопку создания новости
        document.getElementById('create-news-section').classList.add('hidden');
    }
    displayNews(); // Отображаем новости независимо от состояния авторизации
}