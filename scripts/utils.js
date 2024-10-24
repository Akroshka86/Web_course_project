function logUserAction(login, action) {
    // Получаем текущие логи из LocalStorage
    let actions = JSON.parse(localStorage.getItem('userActions')) || [];

    // Добавляем новое действие в массив
    const newAction = {
        login: login,
        action: action,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString()
    };
    actions.push(newAction);

    // Сохраняем обновлённый массив в LocalStorage
    localStorage.setItem('userActions', JSON.stringify(actions));
}

function loadUserActions() {
    // Получаем логи действий из LocalStorage
    let actions = JSON.parse(localStorage.getItem('userActions')) || [];

    const tableBody = document.getElementById('user-actions-table');
    tableBody.innerHTML = '';

    // Проходим по каждому действию и добавляем строку в таблицу
    actions.forEach(action => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${action.login}</td>
            <td>${action.action}</td>
            <td>${action.time}</td>
            <td>${action.date}</td>
        `;

        tableBody.appendChild(row);
    });
}