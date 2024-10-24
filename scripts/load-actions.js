checkAdminAccess();

let originalActions = []; // Массив для хранения исходных данных

// Функция для сортировки таблицы по указанной колонке
function sortTableByColumn(column, order) {
    let actions = JSON.parse(localStorage.getItem('userActions')) || [];

    // Если порядок 'default', восстанавливаем исходные данные
    if (order === 'default') {
        actions = [...originalActions]; // Копируем оригинальные данные
    } else {
        actions.sort((a, b) => {
            if (order === 'asc') {
                return a[column] > b[column] ? 1 : -1;
            } else {
                return a[column] < b[column] ? 1 : -1;
            }
        });
    }

    // Перерисовываем таблицу с отсортированными данными
    updateTable(actions);
}

// Функция для обновления данных в таблице
function updateTable(actions) {
    const tableBody = document.getElementById('user-actions-table');
    tableBody.innerHTML = '';

    actions.forEach(action => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${action.login}</td>
            <td>${action.action}</td>
            <td>${action.time}</td>
            <td>${action.date}</td>
        `;

        tableBody.appendChild(row);
    });
}

// Инициализируем загрузку действий и сортировку при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadUserActions(); // Загружаем действия пользователей при загрузке страницы

    const saveLogButton = document.getElementById('save-log-button');
    if (saveLogButton) {
        saveLogButton.addEventListener('click', saveLogToFile); // Добавляем обработчик для сохранения файла
    }


    // Обработчики для сортировки по каждому заголовку таблицы
    const headers = document.querySelectorAll('th[data-column]');

    headers.forEach(header => {
        // Устанавливаем начальное состояние сортировки
        header.setAttribute('data-order', 'default');

        header.addEventListener('click', () => {
            const column = header.getAttribute('data-column');
            const currentOrder = header.getAttribute('data-order');
            let newOrder;

            // Переключаем между 'desc', 'asc', и 'default'
            if (currentOrder === 'desc') {
                newOrder = 'asc';
            } else if (currentOrder === 'asc') {
                newOrder = 'default';
            } else {
                newOrder = 'desc';
            }

            // Сортируем данные
            sortTableByColumn(column, newOrder);

            // Устанавливаем новый порядок в атрибуте заголовка
            header.setAttribute('data-order', newOrder);
        });
    });
});

// Загружаем действия пользователей
function loadUserActions() {
    let actions = JSON.parse(localStorage.getItem('userActions')) || [];
    
    originalActions = [...actions]; // Сохраняем исходные данные

    updateTable(actions); // Отображаем данные
}


// Функция для сохранения лога в файл
function saveLogToFile() {
    // Получаем логи действий из LocalStorage
    let actions = JSON.parse(localStorage.getItem('userActions')) || [];

    // Формируем содержимое для текстового файла
    let logContent = actions.map(action => 
        `Логин: ${action.login}, Действие: ${action.action}, Время: ${action.time}, Дата: ${action.date}`
    ).join('\n');

    // Создаем Blob из текстового содержимого
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Создаем элемент для скачивания
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_actions_log.txt';  // Имя файла
    document.body.appendChild(a);
    a.click();

    // Удаляем элемент ссылки после скачивания
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

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