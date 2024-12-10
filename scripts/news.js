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
        // Фильтруем новости по заголовку или содержимому
        filteredNews = news.filter(newsItem =>

            // Берем название / содержание новости и смотрим содержится ли в ней строка lowerCaseFilter.
            newsItem.title.toLowerCase().includes(lowerCaseFilter) ||
            newsItem.content.toLowerCase().includes(lowerCaseFilter)
        );
    }  

    // Если пользователь не администратор, убираем скрытые новости из показа
    if (!currentUser || currentUser.role !== 'admin') {
        filteredNews = filteredNews.filter(newsItem => !newsItem.hidden);
    }

    // Рассчитываем индекс начала и конца новостей для текущей страницы
    const startIndex = (page - 1) * newsPerPage;
    const endIndex = page * newsPerPage;

    // slice - вырезает часть массива и возвращает её 
    const paginatedNews = filteredNews.slice(startIndex, endIndex);

    // Проходим по отфильтрованным новостям и отображаем их
    paginatedNews.forEach((newsItem, index) => {
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

    // Если текущая страница больше 3, добавляем многоточие
    if (currentPage > 3) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        dots.classList.add('dots');
        paginationContainer.appendChild(dots);
    }

    // Диапазон кнопок вокруг текущей страницы
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // Добавляем кнопки вокруг текущей страницы
    for (let i = startPage; i <= endPage; i++) {
        paginationContainer.appendChild(createButton(i, i));
    }

    // Если текущая страница меньше totalPages - 2, добавляем многоточие
    if (currentPage < totalPages - 2) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        dots.classList.add('dots');
        paginationContainer.appendChild(dots);
    }

    // Добавляем последнюю кнопку, если страниц больше 1
    if (totalPages > 1) {
        paginationContainer.appendChild(createButton(totalPages, totalPages));
    }
}