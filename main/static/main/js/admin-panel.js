function loadUsers() {
    fetch('/get-users/', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const sortedData = data.sort((a, b) => a.id - b.id); // Сортування за id
        const tableBody = document.getElementById('usersTable');
        tableBody.innerHTML = ''; // Очищення таблиці перед додаванням нових даних

        const roles = {
            '2': 'Зареєстрований користувач',
            '3': 'Модератор',
            '4': 'Адміністратор'
        };

        sortedData.forEach(user => {
            const row = `<tr>
            <td>${user.id}</td>
            <td>${user.login}</td>
            <td>${user.email}</td>
            <td>${roles[user.role]}</td>
            <td>
                <button class="btn btn-primary edit-btn" onclick="updateUser(${user.id})">Редагувати</button>
                <button class="btn btn-danger delete-btn" onclick="testt(() => deleteUser(${user.id}))">Видалити</button>
                </td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => console.error('Помилка:', error));

    // Приховати таблицю статей
    document.getElementById('newsTableContainer').style.display = 'none';
}

function addUser() {
    console.log(addUser);
    const login = document.getElementById('userLogin').value; // Отримання значення поля Логін
    const password = document.getElementById('userPassword').value; // Отримання значення поля Пароль
    const email = document.getElementById('userEmail').value; // Отримання значення поля Email
    const role = document.getElementById('userRole').value; // Отримання значення поля Роль

    // Відправка запиту на сервер для створення нового користувача
    fetch('/add-user/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: `add_username=${login}&add_password=${password}&add_email=${email}&add_role=${role}`,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            swal("Успіх!", data.success, "success");
            // Оновлення списку користувачів після додавання нового користувача
            loadUsers();
            // Закриття модального вікна
            const addUserModal = document.getElementById('addUserModal');
            const modalInstance = bootstrap.Modal.getInstance(addUserModal);
            modalInstance.hide();
        } else if (data.error) {
            swal("Помилка!", data.error, "error");
        }
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

function deleteUser(userId) {
    fetch(`/delete-user/${userId}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Виникла помилка при видаленні користувача.');
        }
    })
    .then(data => {
        swal("Успіх!", data.success, "success");
        // Оновлення списку користувачів
        loadUsers();
    })
    .catch(error => {
        console.error('Помилка:', error);
        swal("Помилка!", error.message, "error");
    });
}

function loadNews() {
    fetch('/get-news/', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const sortedData = data.sort((a, b) => a.id - b.id); // Сортування за id
        const tableBody = document.getElementById('newsTable');
        tableBody.innerHTML = ''; // Очищення таблиці перед додаванням нових даних
        sortedData.forEach(news => {
            // Форматування дати у зручний формат (день.місяць.рік)
            const formattedDate = new Date(news.created_at).toLocaleDateString('uk-UA');
            const row = `<tr>
                <td>${news.id}</td>
                <td>${news.title}</td>
                <td>${news.author_id}</td>
                <td>${formattedDate}</td>
                <td>
                    <button class="btn btn-primary edit-btn" onclick="updateNews(${news.id})">Редагувати</button>
                    <button class="btn btn-danger delete-btn" onclick="testt(() => deleteNews(${news.id}))">Видалити</button>
                </td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => console.error('Помилка:', error));

    // Приховати таблицю користувачів
    document.getElementById('usersTableContainer').style.display = 'none';
}

function addTextarea() {
    var textareaDiv = document.createElement('div');
    textareaDiv.classList.add('mb-3', 'position-relative'); // Додано position-relative для позиціонування хрестика
    textareaDiv.innerHTML = '<label for="newsParagraph" class="form-label">Параграф</label>' +
        '<textarea class="form-control" id="newsParagraph" rows="3"></textarea>' +
        '<span class="delete-field" onclick="deleteField(this)">❌</span>'; // Видалив id хрестика і змінив обробник

    textareaDiv.addEventListener('mouseenter', function() {
        var deleteBtn = this.querySelector('.delete-field');
        if (deleteBtn) {
            deleteBtn.style.opacity = '1';
        }
    });
    textareaDiv.addEventListener('mouseleave', function() {
        var deleteBtn = this.querySelector('.delete-field');
        if (deleteBtn) {
            deleteBtn.style.opacity = '0';
        }
    });

    var dropdownElement = document.querySelector('.dropdown-add-news');
    var parentElement = dropdownElement.parentElement;
    parentElement.insertBefore(textareaDiv, dropdownElement);
}

function addPhoto() {
    var photoDiv = document.createElement('div');
    photoDiv.classList.add('mb-3', 'position-relative'); // Додано position-relative для позиціонування хрестика
    photoDiv.innerHTML = '<label for="newsPhoto" class="form-label">Фотографія</label>' +
        '<input type="file" class="form-control" id="newsPhotoInArticle">' +
        '<span class="delete-field" onclick="deleteField(this)">❌</span>'; // Видалив id хрестика і змінив обробник

    photoDiv.addEventListener('mouseenter', function() {
        var deleteBtn = this.querySelector('.delete-field');
        if (deleteBtn) {
            deleteBtn.style.opacity = '1';
        }
    });
    photoDiv.addEventListener('mouseleave', function() {
        var deleteBtn = this.querySelector('.delete-field');
        if (deleteBtn) {
            deleteBtn.style.opacity = '0';
        }
    });

    var dropdownElement = document.querySelector('.dropdown-add-news');
    var parentElement = dropdownElement.parentElement;
    parentElement.insertBefore(photoDiv, dropdownElement);
}

function deleteField(deleteBtn) {
    var element = deleteBtn.parentNode;
    if (element) {
        element.parentNode.removeChild(element);
    }
}

function addNews() {
    const title = document.getElementById('newsTitle').value;
    const byteContent = document.getElementById('newsByteContent').value;
    const author = document.getElementById('newsAuthor').value;

    // Створення FormData
    const formData = new FormData();
    formData.append('title', title);
    formData.append('byte_content', byteContent);
    formData.append('author', author);

    // Отримання HTML-контенту з textarea та фотографії
    const textarea = document.querySelector('#newsForm textarea');
    const fileInput = document.querySelector('#newsPhoto');
    const fileInputInArticle = document.querySelector('#newsPhotoInArticle');
    let htmlContent = '';

    // Додавання тексту з textarea до HTML-контенту
    htmlContent += `<p class="card-text">${textarea.value}</p>`;

    // Додавання фотографії з поля "Фотографія" до FormData, але не до HTML-контенту
    const file = fileInput.files[0];
    if (file) {
        formData.append('image', file);
    }

    // Додавання фотографії з поля "Фотографія поста" до FormData та HTML-контенту
    const fileInArticle = fileInputInArticle.files[0];
    if (fileInArticle) {
        formData.append('image_in_article', fileInArticle);
        // Якщо це фотографія, обгорнути тегом <img> з id "newsPhotoInArticle"
        htmlContent += `<img src="${URL.createObjectURL(fileInArticle)}" class="img-fluid mb-3" id="newsPhotoInArticle" alt="Uploaded Image">`;
    }

    // Додавання HTML-контенту до FormData
    formData.append('html_content', htmlContent);

    // Відправка даних на сервер
    fetch('/add-news/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            swal("Успіх!", data.success, "success");
            loadNews(); // Оновлення списку новин
            const addNewsModal = document.getElementById('addNewsModal');
            const modalInstance = bootstrap.Modal.getInstance(addNewsModal);
            modalInstance.hide(); // Закриття модального вікна
        } else if (data.error) {
            swal("Помилка!", data.error, "error");
        }
    })
    .catch(error => console.error('Помилка:', error));
}

function deleteNews(newsId) {
    fetch(`/delete-news/${newsId}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Виникла помилка при видаленні новини.');
        }
    })
    .then(data => {
        swal("Успіх!", data.success, "success");
        // Оновлення списку новин
        loadNews();
    })
    .catch(error => {
        console.error('Помилка:', error);
        swal("Помилка!", error.message, "error");
    });
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