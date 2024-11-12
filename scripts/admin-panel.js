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
                window.location.href = `edit-news.html?edit=${index}`;
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', () => deleteNews(index));

            // Добавляем кнопки в контейнер
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);

            // Если пользователь администратор, добавляем кнопку "Скрыть" или "Восстановить"
            if (currentUser.role === 'admin') {
                const hideButton = document.createElement('button');
                hideButton.textContent = newsItem.hidden ? 'Восстановить' : 'Скрыть';
                hideButton.addEventListener('click', () => {
                    if (newsItem.hidden) {
                        restoreNews(index);
                    } else {
                        hideNews(index);
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

    // Результат деления числа новостей на 10 и возвращаем целое число (53/10 = 6)
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

// Функция для удаления новости
function deleteNews(index) {
    const news = JSON.parse(localStorage.getItem('news')) || [];

    // Удаляем новость по индексу
    news.splice(index, 1); 

    // Сохраняем localStorage (ключ, значение)
    localStorage.setItem('news', JSON.stringify(news));

    // Сохранение в логи
    logUserAction(loadSession().username, `Удалил новость`);

    displayNews();
}

function hideNews(index) {
    const news = JSON.parse(localStorage.getItem('news')) || [];

    // Устанавливаем атрибут hidden в true
    news[index].hidden = true; 
    localStorage.setItem('news', JSON.stringify(news));

    logUserAction(loadSession().username, `Скрыл новость: "${news[index].title}"`);

    displayNews();
}

function restoreNews(index) {
    const news = JSON.parse(localStorage.getItem('news')) || [];

    // Устанавливаем атрибут hidden в false
    news[index].hidden = false; 
    localStorage.setItem('news', JSON.stringify(news));

    logUserAction(loadSession().username, `Восстановил новость: "${news[index].title}"`);

    displayNews();
}




// Функция проверки доступа к странице администратора
function checkAdminAccess() {
    const currentUser = loadSession();

    // Если пользователь не залогинен или его роль не "admin", перенаправляем на главную страницу
    if (!currentUser || currentUser.role !== 'admin') {

        // Перенаправляем на главную страницу
        window.location.href = 'index.html'; 
    }
}





