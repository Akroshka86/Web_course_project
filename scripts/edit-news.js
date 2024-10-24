document.addEventListener('DOMContentLoaded', () => {
    const newsTitleInput = document.getElementById('news-title');
    const newsContentInput = document.getElementById('news-content');

    const currentUser = loadSession();  // Загружаем текущего пользователя
    if (!currentUser) {
        alert('Вы должны войти для создания или редактирования новости.');
        window.location.href = 'index.html';
        return;
    }

    // Проверяем, есть ли индекс новости для редактирования
    const urlParams = new URLSearchParams(window.location.search);
    const newsIndex = urlParams.get('edit');

    if (newsIndex !== null) {
        // Режим редактирования, меняем текст кнопки и заполняем поля
        const allNews = JSON.parse(localStorage.getItem('news')) || [];
        const newsItem = allNews[newsIndex]; // Получаем новость по оригинальному индексу

        if (newsItem && (newsItem.username === currentUser.username || currentUser.role === 'admin')) {
            newsTitleInput.value = newsItem.title;
            newsContentInput.value = newsItem.content;
        } else {
            alert('У вас нет прав на редактирование этой новости.');
            window.location.href = 'index.html';
            return;
        }
    }

    // Обработка отправки формы
    document.getElementById('news-form').addEventListener('submit', (e) => {
        e.preventDefault();  // Предотвращаем перезагрузку страницы

        const title = newsTitleInput.value.trim();
        const content = newsContentInput.value.trim();

        if (title && content) {
            const allNews = JSON.parse(localStorage.getItem('news')) || [];

            if (newsIndex !== null) {
                // Редактирование существующей новости в оригинальном массиве
                allNews[newsIndex].title = title;
                allNews[newsIndex].content = content;

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
            alert('Пожалуйста, заполните все поля.');
        }
    });
});