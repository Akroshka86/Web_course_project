// Создаем ключи для хранения данных
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
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        alert('Пользователь с таким именем уже существует!');
        return false;
    }
    
    // Добавляем элемент в конец массива
    users.push({ username, password });
    saveUsers(users);
    return true;
}

// Функция для входа
function login(username, password) {
    const users = loadUsers();

    // some - возвращает False или True, а find сам объект
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        alert('Неверное имя пользователя или пароль!');
        return false;
    }

    saveSession(user);
    return true;
}