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
            <p>${newsItem.content}</p>
            <small>Автор: ${newsItem.username ? newsItem.username : 'Неизвестный'}</small>
            <small>Отправлено: ${newsItem.createdAt}</small>
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

    // Результат деления числа новостей на 10 и возвращаем целое число
    const totalPages = Math.ceil(totalNews / newsPerPage);

    // Создаем кнопки для пагинации
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('page-button');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }

        pageButton.addEventListener('click', () => {

            // Отображаем новости для выбранной страницы
            displayNews('', i); 
        });

        paginationContainer.appendChild(pageButton);
    }
}