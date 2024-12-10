// Скрипт для редактирования новости

// Загружается когда загружен DOM
document.addEventListener('DOMContentLoaded', () => {
    const newsTitleInput = document.getElementById('news-title');
    const newsContentInput = document.getElementById('news-content');

    // Загружаем текущего пользователя
    const currentUser = loadSession();  
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Проверяем, есть ли индекс новости для редактирования
    // URLSearchParams - метод для работы с параметрами строки запроса
    // window.location.search = ?edit=3
    // newsIndex = 3
    const urlParams = new URLSearchParams(window.location.search);
    const newsIndex = urlParams.get('edit');

    if (newsIndex !== null) {
        const allNews = JSON.parse(localStorage.getItem('news')) || [];

        // Получаем новость по оригинальному индексу
        const newsItem = allNews[newsIndex];

        if (newsItem && (newsItem.username === currentUser.username || currentUser.role === 'admin')) {
            newsTitleInput.value = newsItem.title;
            newsContentInput.value = newsItem.content;
        } else {
            window.location.href = 'index.html';
            return;
        }
    }

    // Обработка отправки формы
    document.getElementById('news-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const title = newsTitleInput.value.trim();
        const content = newsContentInput.value.trim();

        if (title && content) {
            const allNews = JSON.parse(localStorage.getItem('news')) || [];

            if (newsIndex !== null) {

                // Редактирование существующей новости в оригинальном массиве
                allNews[newsIndex].title = title;
                allNews[newsIndex].content = content;

                // Логирование действия пользователя
                logUserAction(currentUser.username, `Отредактировал новость: "${allNews[newsIndex].title}"`);
            }

            // Сохраняем новости в localStorage
            localStorage.setItem('news', JSON.stringify(allNews));

            if (currentUser.role === 'admin'){
                // Перенаправляем на страницу с новостями
                window.location.href = 'admin-page.html';
            } else{
                // Перенаправляем на страницу с новостями
                window.location.href = 'user-messages.html';
            }            
        } else {
        }
    });
});