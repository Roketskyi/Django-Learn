function loadUsers() {
    fetch('/get-users/', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('usersTable');
        tableBody.innerHTML = ''; // Очищення таблиці перед додаванням нових даних
        data.forEach(user => {
            const row = `<tr>
            <td>${user.id}</td>
            <td>${user.login}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button onclick="editUser(${user.id})">Редагувати</button>
                <button onclick="testt(() => deleteUser(${user.id}))">Видалити</button>
                </td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => console.error('Помилка:', error));
}
