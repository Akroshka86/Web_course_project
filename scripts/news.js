// Функция для отображения новостей
function displayNews(filter = '') {
    const newsList = document.getElementById('news-list');

    // Очищаем список новостей
    newsList.innerHTML = ''; 

    const news = JSON.parse(localStorage.getItem('news')) || [];

    // Получаем текущего пользователя для проверки
    const currentUser = loadSession();

    // Преобразуем фильтр в нижний регистр для корректного сравнения
    const lowerCaseFilter = filter.toLowerCase();


    // Фильтруем новости по заголовку или содержимому
    const filteredNews = news.filter(newsItem =>

        // Берем название / содержание новости и смотрим содержится ли в ней строка lowerCaseFilter.
        newsItem.title.toLowerCase().includes(lowerCaseFilter) ||
        newsItem.content.toLowerCase().includes(lowerCaseFilter)
    );

    // Проходим по отфильтрованным новостям и отображаем их
    filteredNews.forEach((newsItem, index) => {

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
            ${newsItem.hidden ? '<small>(Скрыто)</small>' : ''}
        `;

        // Если текущий пользователь автор, показываем кнопки редактирования и удаления
        if (currentUser && (currentUser.username === newsItem.username || currentUser.role === 'admin')) {
            const editButton = document.createElement('button');
            editButton.textContent = 'Редактировать';
            editButton.addEventListener('click', () => editNews(index));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', () => deleteNews(index));

            newsElement.appendChild(editButton);
            newsElement.appendChild(deleteButton);

            // Если пользователь администратор, добавляем кнопку "Скрыть" или "Восстановить"
            if (currentUser.role === 'admin') {
                const hideButton = document.createElement('button');
                hideButton.textContent = newsItem.hidden ? 'Восстановить' : 'Скрыть';
                hideButton.addEventListener('click', () => {
                    if (newsItem.hidden) {
                        restoreNews(index); // Восстанавливаем новость
                    } else {
                        hideNews(index); // Скрываем новость
                    }
                });

                newsElement.appendChild(hideButton);
            }
        }
        
        newsList.appendChild(newsElement);
    });
}

// Функция для редактирования новости
function editNews(index) {
    const news = JSON.parse(localStorage.getItem('news')) || [];
    const newsItem = news[index];

    const newTitle = prompt('Введите новый заголовок:', newsItem.title);
    const newContent = prompt('Введите новый текст:', newsItem.content);

    if (newTitle && newContent) {
        news[index].title = newTitle;
        news[index].content = newContent;
        localStorage.setItem('news', JSON.stringify(news));
        displayNews(); // Обновляем отображение новостей
    }
}

// Функция для удаления новости
function deleteNews(index) {
    const news = JSON.parse(localStorage.getItem('news')) || [];
    news.splice(index, 1); // Удаляем новость по индексу
    localStorage.setItem('news', JSON.stringify(news));
    displayNews(); // Обновляем отображение новостей
}

function hideNews(index) {
    const news = JSON.parse(localStorage.getItem('news')) || [];
    news[index].hidden = true; // Устанавливаем атрибут hidden в true
    localStorage.setItem('news', JSON.stringify(news));
    displayNews(); // Обновляем отображение новостей
}

function restoreNews(index) {
    const news = JSON.parse(localStorage.getItem('news')) || [];
    news[index].hidden = false; // Устанавливаем атрибут hidden в false
    localStorage.setItem('news', JSON.stringify(news));
    displayNews(); // Обновляем отображение новостей
}