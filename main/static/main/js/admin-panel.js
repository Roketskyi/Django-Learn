document.addEventListener("DOMContentLoaded", function() {
    const loadUsersButton = document.querySelector('button.btn-primary');
    const toggleUsersTableButton = document.querySelector('button.nav-link');

    function toggleUsersTable() {
        const usersTableSection = document.querySelector('.users-table-section');
        usersTableSection.style.display = usersTableSection.style.display === 'none' ? 'block' : 'none';
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
    
    function loadUsers() {
        fetch('/get-users/')
            .then(response => response.json())
            .then(data => {
                const tableBody = document.getElementById('usersTable');
                tableBody.innerHTML = '';
                data.forEach(user => {
                    const roleName = getRoleName(user.role); // Використання функції для отримання назви ролі
                    const row = document.createElement("tr");
                    row.innerHTML = `<td>${user.id}</td>
                                     <td>${user.login}</td>
                                     <td>${user.email}</td>
                                     <td>${user.password}</td>
                                     <td>${roleName}</td>
                                     <td><button class="btn btn-primary edit-btn" data-user-id="${user.id}" data-login="${user.login}" data-email="${user.email}" data-password="${user.password}" data-role="${user.role}">Редагувати</button>
                                     <button class="btn btn-danger delete-btn" data-user-id="${user.id}">Видалити</button></td>`;
                    tableBody.appendChild(row);
                });
                addDeleteEventListeners();
                addEditEventListeners(); 
            });
    }
    
    function getRoleName(roleId) {
        const numericRoleId = parseInt(roleId, 10); // Перетворення рядка в число
        switch(numericRoleId) {
            case 2:
                return 'Зареєстрований користувач';
            case 3:
                return 'Модератор';
            case 4:
                return 'Адміністратор';
            default:
                return 'undefined'; // Для невизначених або невідповідних значень
        }
    }
    
    
    function updateUser(userId) {
        const login = document.getElementById('editUserLogin').value;
        const email = document.getElementById('editUserEmail').value;
        const password = document.getElementById('editUserPassword').value;
        const role = document.getElementById('editUserRole').value;
    
        const csrfToken = getCookie('csrftoken');
        
        fetch(`/update-user/${userId}/`, {
            method: 'POST',  // Змінено з PUT на POST
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',  // Змінено на правильний тип вмісту для POST
                'X-CSRFToken': csrfToken
            },
            body: `login=${encodeURIComponent(login)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(role)}`
        })
        .then(response => response.json())
        .then(data => {
            alert(data.success || data.error);
            loadUsers();
        })
        .catch(error => console.error('Error:', error));        
    }
    

    function addDeleteEventListeners() {
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                deleteUser(this.getAttribute('data-user-id'));
            });
        });
    }

    function addEditEventListeners() {
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-user-id');
                const login = this.getAttribute('data-login');
                const email = this.getAttribute('data-email');
                const password = this.getAttribute('data-password');
                const role = this.getAttribute('data-role');

                const modal = document.getElementById('editUserModal');
                const editUserLogin = modal.querySelector('#editUserLogin');
                const editUserEmail = modal.querySelector('#editUserEmail');
                const editUserPassword = modal.querySelector('#editUserPassword');
                const editUserRole = modal.querySelector('#editUserRole');
                const saveButton = modal.querySelector('.modal-footer .btn-primary');

                editUserLogin.value = login;
                editUserEmail.value = email;
                editUserPassword.value = password;
                editUserRole.value = role;

                saveButton.textContent = 'Зберегти';
                saveButton.removeEventListener('click', updateUser); 
                saveButton.addEventListener('click', function() {
                    updateUser(userId);
                });

                const bootstrapModal = new bootstrap.Modal(modal);
                bootstrapModal.show();
            });
        });
    }

    function deleteUser(userId) {
        const csrfToken = getCookie('csrftoken');
        fetch(`/delete-user/${userId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            }
        })
        .then(response => response.json())
        .then(data => {
            alert(data.success || data.error);
            loadUsers();
        })
        .catch(error => console.error('Error:', error));
    }

    loadUsersButton.addEventListener('click', loadUsers);
    toggleUsersTableButton.addEventListener('click', toggleUsersTable);
});
