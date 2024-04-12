function toggleUsersTable() {
    const usersTableSection = document.querySelector('.users-table-section');
    usersTableSection.style.display = usersTableSection.style.display === 'none' ? 'block' : 'none';
}

function loadUsers() {
    fetch('/get-users/')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('usersTable');
            tableBody.innerHTML = '';
            data.forEach(user => {
                const row = `<tr>
                                <td>${user.id}</td>
                                <td>${user.login}</td>
                                <td>${user.email}</td>
                                <td>${user.role}</td>
                                <td><button onclick="deleteUser(${user.id})" class="btn btn-danger">Видалити</button></td>
                             </tr>`;
                tableBody.innerHTML += row;
            });
        });
}

function getCookie(name) {
    let cookieValue = null;
    
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }

    return cookieValue;
}

function deleteUser(userId) {
    const csrfToken = getCookie('csrftoken');  // Отримання CSRF токена
    fetch(`/delete-user/${userId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken  // Включення CSRF токена у заголовок
        }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.success || data.error);
        loadUsers();  // Оновлення списку користувачів після видалення
    })
    .catch(error => console.error('Error:', error));
}