// Функция для отображения новостей
function displayNews() {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = ''; // Очищаем список новостей

    const news = JSON.parse(localStorage.getItem('news')) || [];
    const currentUser = loadSession(); // Получаем текущего пользователя для проверки

    news.forEach((newsItem, index) => {
        const newsElement = document.createElement('div');
        newsElement.classList.add('news-item');
        
        // Формируем HTML для каждой новости, включая автора
        newsElement.innerHTML = `
            <h3>${newsItem.title}</h3>
            <p>${newsItem.content}</p>
            <small>Автор: ${newsItem.username ? newsItem.username : 'Неизвестный'}</small>
        `;

        // Если текущий пользователь автор, показываем кнопки редактирования и удаления
        if (currentUser && currentUser.username === newsItem.username) {
            const editButton = document.createElement('button');
            editButton.textContent = 'Редактировать';
            editButton.addEventListener('click', () => editNews(index));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', () => deleteNews(index));

            newsElement.appendChild(editButton);
            newsElement.appendChild(deleteButton);
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