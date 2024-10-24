checkAdminAccess();
document.addEventListener('DOMContentLoaded', function() {
    loadUserActions(); // Загружаем действия пользователей при загрузке страницы    
});

// Проверка доступа к странице администратора
function checkAdminAccess() {
    const currentUser = loadSession();

    // Если пользователь не залогинен или его роль не "admin", перенаправляем на главную страницу
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'index.html'; // Перенаправляем на главную страницу
    }
}

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

