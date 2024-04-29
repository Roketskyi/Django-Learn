function loadUsers() {
    fetch('/get-users/', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const sortedData = data.sort((a, b) => a.id - b.id); // Сортування за id
        const tableBody = document.getElementById('usersTable');
        tableBody.innerHTML = ''; // Очищення таблиці перед додаванням нових данихх
        sortedData.forEach(user => {
            const row = `<tr>
            <td>${user.id}</td>
            <td>${user.login}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="btn btn-primary edit-btn" onclick="updateUser(${user.id})">Редагувати</button>
                <button class="btn btn-danger delete-btn" onclick="testt(() => deleteUser(${user.id}))">Видалити</button>
                </td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => console.error('Помилка:', error));
}

function updateUser(userId) {
    fetch(`/get-user/${userId}/`, { method: 'GET' })
    .then(response => response.json())
    .then(user => {
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUserLogin').value = user.login;
        document.getElementById('editUserEmail').value = user.email;
        document.getElementById('editUserRole').value = user.role;

        var myModal = new bootstrap.Modal(document.getElementById('editUserModal'));
        myModal.show();
    })
    .catch(error => console.error('Помилка:', error));
}

function saveChanges() {
    const userId = document.getElementById('editUserId').value;
    const login = document.getElementById('editUserLogin').value;
    const email = document.getElementById('editUserEmail').value;
    const password = document.getElementById('editUserPassword').value;
    const role = document.getElementById('editUserRole').value;

    fetch(`/update-user/${userId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: `login=${login}&email=${email}&password=${password}&role=${role}`,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // alert(data.success);
            // Оновлення списку користувачів
            loadUsers();
            // Закриття модального вікна
            const editUserModal = document.getElementById('editUserModal');
            const modalInstance = bootstrap.Modal.getInstance(editUserModal);
            modalInstance.hide();
        }
    })
    .catch(error => console.error('Помилка:', error));
}

// Функція для отримання значення cookie
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
