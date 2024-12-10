// Скрипт для авторизации

// Кключи для хранения данных
const LOCAL_STORAGE_USERS_KEY = 'forumUsers';
const LOCAL_STORAGE_SESSION_KEY = 'forumSession';

// Функция для загрузки пользователей из Local Storage, если пользователей нет, то возвращается пустой массив
function loadUsers() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY)) || [];
}

// Функция для сохранения пользователей в Local Storage. stringify - преобразует массив пользователей в строку
function saveUsers(users) {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
}

// Функция для загрузки сессии (текущий пользователь)
function loadSession() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_SESSION_KEY));
}

// Функция для сохранения сессии
function saveSession(user) {
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(user));
}

// Функция для завершения сессии (выход)
function clearSession() {

    const user = loadSession();
    // Логируем действие о выходе из аккаунта
    if (user) {
        logUserAction(user.username, 'Выход из аккаунта');
    }

    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
}

// Функция для проверки авторизации, возвращает True или False
function isAuthenticated() {
    return loadSession() !== null;
}

// Функция для регистрации нового пользователя
function register(username, password) {
    // Загрузка всех пользователей в переменную
    const users = loadUsers();
    
    // Проверка, существует ли такой пользователь (для каждого user проверяем совпадает ли user.username с username)
    // some - проверяет, есть ли в массиве хотя бы один элемент, который удовлетворяет заданному условию
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return false;
    }

    // Определяем роль пользователя: администратор или обычный пользователь
    const role = (username === 'admin') ? 'admin' : 'user';

    // Добавляем элемент в конец массива
    users.push({ username, password, role });

    saveUsers(users);

    // Логируем действие о регистрации пользователя
    logUserAction(username, 'Регистрация нового пользователя');

    return true;
}

// Функция для входа
function login(username, password) {
    const users = loadUsers();

    // some - возвращает False или True, а find сам объект
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return false;
    }

    saveSession(user);

    // Логируем действие о входе в аккаунт
    logUserAction(username, 'Вход в аккаунт');

    return true;
}