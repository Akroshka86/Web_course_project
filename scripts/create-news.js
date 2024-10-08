document.getElementById('news-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('news-title').value;
    const content = document.getElementById('news-content').value;

    // Получаем текущего пользователя
    const currentUser = loadSession(); 

    if (!currentUser) {
        alert('Вы должны войти, чтобы добавить новость.');
        return;
    }

    if (title && content) {
        const news = JSON.parse(localStorage.getItem('news')) || [];
        
        // Добавляем новость в начало массива
        news.unshift({ title, content, username: currentUser.username, hidden: false });
        
        localStorage.setItem('news', JSON.stringify(news));

        // Перенаправляем на главную страницу после создания новости
        window.location.href = 'index.html';
    }
});