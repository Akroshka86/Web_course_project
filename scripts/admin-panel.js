// Скрипт для панели администратора

// Вызываем проверку при загрузке страницы администратора
checkAdminAccess();

// Переменная для текущей страницы
let currentPage = 1;

// Максимальное количество новостей на странице
const newsPerPage = 10; 

// Функция для отображения новостей
function displayNews(filter = '', page = 1) {

    // Устанавливаем текущую страницу
    currentPage = page; 
    const newsList = document.getElementById('news-list');

    // Очищаем список новостей
    newsList.innerHTML = ''; 

    const news = JSON.parse(localStorage.getItem('news')) || [];

    // Получаем текущего пользователя для проверки
    const currentUser = loadSession();

    // Преобразуем фильтр в нижний регистр для корректного сравнения
    const lowerCaseFilter = filter.toLowerCase();


    // Если длина фильтра меньше 3 символов, показываем все новости без фильтрации
    let filteredNews;
    if (lowerCaseFilter.length < 3) {
        filteredNews = news;
    } else {
        // Фильтруем новости по заголовку или содержимому (возвращает True или False)
        filteredNews = news.filter(newsItem =>

            // Берем название / содержание новости и смотрим содержится ли в ней строка lowerCaseFilter.
            newsItem.title.toLowerCase().includes(lowerCaseFilter) ||
            newsItem.content.toLowerCase().includes(lowerCaseFilter)
        );
    }  

    // Рассчитываем индекс начала и конца новостей для текущей страницы
    const startIndex = (page - 1) * newsPerPage;
    const endIndex = page * newsPerPage;

    // slice - вырезает часть массива и возвращает её 
    const paginatedNews = filteredNews.slice(startIndex, endIndex);

    // Проходим по отфильтрованным новостям и отображаем их
    paginatedNews.forEach((newsItem, index) => {

        // Если новость скрыта, то не показываем
        if (newsItem.hidden && (!currentUser || currentUser.role !== 'admin')) {
            return;
        }

        const newsElement = document.createElement('div');
        newsElement.classList.add('news-item');
        
        // Формируем HTML для каждой новости, включая автора
        newsElement.innerHTML = `
            <h3>${newsItem.title}</h3>            
            <p>${newsItem.content}</p><br>
            <div class = 'con-author'>
            <small class='author'>Автор: ${newsItem.username ? newsItem.username : 'Неизвестный'}</small>
            <small>Отправлено: ${newsItem.createdAt}</small>
            </div>
            ${newsItem.hidden ? '<small>(Скрыто)</small>' : ''}
        `;

        // Если текущий пользователь автор, показываем кнопки редактирования и удаления
        if (currentUser && (currentUser.username === newsItem.username || currentUser.role === 'admin')) {
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');
            const editButton = document.createElement('button');
            editButton.textContent = 'Редактировать';
            editButton.addEventListener('click', () => {
                const originalIndex = news.findIndex(item => item === newsItem); // Получаем оригинальный индекс (обращаясь к первому массиву новостей)
                window.location.href = `edit-news.html?edit=${originalIndex}`;
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', () => {
                const originalIndex = news.findIndex(item => item === newsItem); // Получаем оригинальный индекс для удаления
                deleteNews(originalIndex); // Передаём оригинальный индекс в функцию удаления
            });

            // Добавляем кнопки в контейнер
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);

            // Если пользователь администратор, добавляем кнопку "Скрыть" или "Восстановить"
            if (currentUser.role === 'admin') {
                const hideButton = document.createElement('button');
                const originalIndex = news.findIndex(item => item === newsItem); // Получаем оригинальный индекс для удаления
                hideButton.textContent = newsItem.hidden ? 'Восстановить' : 'Скрыть';
                hideButton.addEventListener('click', () => {
                    if (newsItem.hidden) {
                        restoreNews(originalIndex);
                    } else {
                        hideNews(originalIndex);
                    }
                });

                buttonContainer.appendChild(hideButton);
            }
            newsElement.appendChild(buttonContainer)
        }

        newsList.appendChild(newsElement);
    });

    // Отображаем кнопки пагинации
    displayPagination(filteredNews.length);
}

// Функция для отображения кнопок пагинации
function displayPagination(totalNews) {
    const paginationContainer = document.getElementById('pagination');

    // Очищаем контейнер
    paginationContainer.innerHTML = ''; 

    // Общее количество страниц
    const totalPages = Math.ceil(totalNews / newsPerPage);

    // Функция для создания кнопки
    const createButton = (text, page) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add('page-button');
        if (page === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = page;
            displayNews('', currentPage);
            displayPagination(totalNews);
        });
        return button;
    };

    // Добавляем кнопку "1"
    paginationContainer.appendChild(createButton(1, 1));

    // Далее добавляем многоточие (1 ...)
    // Если текущая страница больше 3, добавляем многоточие
    if (currentPage > 3) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        dots.classList.add('dots');
        paginationContainer.appendChild(dots);
    }

    // Добавляем текщую страницу и страницы вокруг (1 ... 2 3 4)
    // Диапазон кнопок вокруг текущей страницы
    // Выбирает от максимально от 2 до текущей  - 1
    const startPage = Math.max(2, currentPage - 1);

    // Выбирает от Минимальное от всех - 1 до текущей  + 1
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // Добавляем кнопки вокруг текущей страницы
    for (let i = startPage; i <= endPage; i++) {
        paginationContainer.appendChild(createButton(i, i));
    }


    // Добавляем многоточние (1 ... 2 3 4 ...)
    // Если текущая страница меньше totalPages - 2, добавляем многоточие
    if (currentPage < totalPages - 2) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        dots.classList.add('dots');
        paginationContainer.appendChild(dots);
    }

    // Добавляем последнюю кнопку, если страниц больше 1 (1 ... 2 3 4 ... 10)
    if (totalPages > 1) {
        paginationContainer.appendChild(createButton(totalPages, totalPages));
    }
}

// Функция для удаления новости
function deleteNews(index) {
    const news = JSON.parse(localStorage.getItem('news')) || [];

    // Удаляем новость по индексу
    news.splice(index, 1); 

    // Сохраняем localStorage (ключ, значение)
    localStorage.setItem('news', JSON.stringify(news));

    // Сохранение в логи
    logUserAction(loadSession().username, `Удалил новость`);

    // Получение значения из поиска, чтобы при удалении не сбросился поиск
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput ? searchInput.value : '';

    displayNews(searchTerm);
}

function hideNews(index) {
    const news = JSON.parse(localStorage.getItem('news')) || [];

    // Устанавливаем атрибут hidden в true
    news[index].hidden = true; 
    localStorage.setItem('news', JSON.stringify(news));

    logUserAction(loadSession().username, `Скрыл новость: "${news[index].title}"`);

    // Получение значения из поиска, чтобы при скрытии/восстановлении не сбросился поиск
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput ? searchInput.value : '';

    displayNews(searchTerm);
}

function restoreNews(index) {
    const news = JSON.parse(localStorage.getItem('news')) || [];

    // Устанавливаем атрибут hidden в false
    news[index].hidden = false; 
    localStorage.setItem('news', JSON.stringify(news));

    logUserAction(loadSession().username, `Восстановил новость: "${news[index].title}"`);
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput ? searchInput.value : '';

    displayNews(searchTerm);
}




// Функция проверки доступа к странице администратора
function checkAdminAccess() {
    const currentUser = loadSession();
    const authModal = document.getElementById('auth-modal');
    const sectionContent = document.querySelector('.main');

    // Если пользователь не залогинен или его роль не "admin", показываем модальное окно
    if (!currentUser || currentUser.role !== 'admin') {
        sectionContent.classList.add('hidden'); // Скрываем контент страницы

        // Показ модального окна
        authModal.classList.remove('hidden');
        document.getElementById('auth-title').textContent = 'Вход для администратора';

        // Обработка попытки входа в модальном окне
        const authForm = document.getElementById('auth-form');
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Если вход успешен и роль администратора
            if (login(username, password) && loadSession().role === 'admin') {
                authModal.classList.add('hidden');
                sectionContent.classList.remove('hidden'); // Показываем содержимое страницы
                updateUI();
            } else {
                window.location.href = 'index.html'; 
            }
        });
    } else {
        // Если пользователь уже авторизован и администратор, показываем содержимое
        sectionContent.classList.remove('hidden');
    }
}





