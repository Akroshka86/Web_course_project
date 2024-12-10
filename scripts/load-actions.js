// Скрипт для логирования

checkAdminAccess();

// Массив для хранения исходных данных
let originalActions = []; 

// Функция для сортировки таблицы по указанной колонке
function sortTableByColumn(column, order) {
    let actions = JSON.parse(localStorage.getItem('userActions')) || [];

    // Если порядок 'default', восстанавливаем исходные данные
    if (order === 'default') {

        // Копируем оригинальные данные (в новое место памяти)
        actions = [...originalActions];
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

    // Загружаем действия пользователей при загрузке страницы
    loadUserActions(); 

    // Добавляем обработчик для сохранения файла
    const saveLogButton = document.getElementById('save-log-button');

    // Если кнопка существует, то добавляем обработчик события
    if (saveLogButton) {
        saveLogButton.addEventListener('click', saveLogToFile);
    }

    // Добавляем обработчик для очистки логов
    const clearLogButton = document.getElementById('clear-log-button');
    if (clearLogButton) {
        clearLogButton.addEventListener('click', clearLogs);
    }


    // Обработчики для сортировки по каждому заголовку таблицы (querySelectorAll - возвращает все найденные элементы)
    const headers = document.querySelectorAll('th[data-column]');

    headers.forEach(header => {
        // Устанавливаем атрибут data-orde в значение default
        header.setAttribute('data-order', 'default');

        header.addEventListener('click', () => {

            // Получаем значение атрибута
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

            // Устанавливаем атрибут data-orde в новое значение
            header.setAttribute('data-order', newOrder);
        });
    });
});

// Загружаем действия пользователей
function loadUserActions() {
    let actions = JSON.parse(localStorage.getItem('userActions')) || [];
    
    // Сохраняем исходные данные
    originalActions = [...actions]; 

    // Отображаем данные
    updateTable(actions); 
}


// Функция для сохранения лога в файл
function saveLogToFile() {

    // Получаем логи действий из LocalStorage
    let actions = JSON.parse(localStorage.getItem('userActions')) || [];

    // Формируем содержимое для текстового файла
    // map - создает новый массив
    // join - объединяет все элименты в одну строку разделяя их
    let logContent = actions.map(action => 
        `Логин: ${action.login}, Действие: ${action.action}, Время: ${action.time}, Дата: ${action.date}`
    ).join('\n');

    // Создаем объект Blob из текстового содержимого, тип: обычный текст
    const blob = new Blob([logContent], { type: 'text/plain' });

    // Создаем временный URL
    const url = URL.createObjectURL(blob);

    // Создаем элемент для скачивания
    const a = document.createElement('a');
    // Устанавливаем ссылку на элемент
    a.href = url;
    // Указываем, что его нужно скачать
    a.download = 'user_actions_log.txt';  // Имя файла
    document.body.appendChild(a);
    a.click();

    // Удаляем элемент ссылки после скачивания
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Функция для очистки логов
function clearLogs() {
    // Удаляем логи из LocalStorage
    localStorage.removeItem('userActions');

    // Очищаем таблицу на странице
    const tableBody = document.getElementById('user-actions-table');
    tableBody.innerHTML = '';
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