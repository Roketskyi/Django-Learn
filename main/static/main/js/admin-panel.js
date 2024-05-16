var addedElements = [];

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
    textareaDiv.classList.add('mb-3', 'position-relative');
    var index = document.querySelectorAll('.newsParagraph').length + 1;
    textareaDiv.innerHTML = '<label for="newsParagraph' + index + '" class="form-label">Параграф</label>' +
        '<textarea id="newsParagraph' + index + '" class="form-control newsParagraph" rows="3"></textarea>' +
        '<span class="delete-field" onclick="deleteField(this)">❌</span>';

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
    
    addedElements.push('textarea' + index);
}

function addPhoto() {
    var photoDiv = document.createElement('div');
    photoDiv.classList.add('mb-3', 'position-relative');
    var index = document.querySelectorAll('.newsPhotoInArticle').length + 1;
    photoDiv.innerHTML = '<label for="newsPhoto' + index + '" class="form-label">Фотографія</label>' +
        '<input type="file" id="newsPhoto' + index + '" class="form-control newsPhotoInArticle" onchange="showImagePreview(this)">' +
        '<span class="delete-field" onclick="deleteField(this)">❌</span>';

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
    
    addedElements.push('photo' + index);
}

function addNews() {
    var formData = new FormData();
    formData.append('title', document.querySelector('.newsTitle').value);
    formData.append('byte_content', document.querySelector('.newsByteContent').value);
    formData.append('author', document.querySelector('.newsAuthor').value);

    var htmlContent = ''; // Змінна для збереження HTML-контенту новини

    // Збираємо HTML-контент параграфів та фотографій
    addedElements.forEach(function(element) {
        var index = element.substring(element.length - 1);
        if (element.startsWith('textarea')) {
            var paragraph = document.getElementById('newsParagraph' + index);
            htmlContent += '<p class="card-text paragraphInArticle">' + paragraph.value + '</p>';
        } else if (element.startsWith('photo')) {
            var photo = document.getElementById('newsPhoto' + index);
            htmlContent += '<img src="' + URL.createObjectURL(photo.files[0]) + '" class="img-fluid mb-3 newsPhotoInArticle" alt="Uploaded Image">';
        }
    });

    formData.append('html_content', htmlContent);

    var imageFile = document.querySelector('.newsPhoto').files[0];
    formData.append('image', imageFile);

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



function updateNews(newsId) {
    fetch(`/get-news/${newsId}/`, { method: 'GET' })
    .then(response => response.json())
    .then(news => {
        document.getElementById('editNewsId').value = news.id;
        document.getElementById('editNewsTitle').value = news.title;
        document.getElementById('editNewsByteContent').value = news.byte_content;
        document.getElementById('editNewsAuthor').value = news.author;
        
        // Очищення htmlContent від попередніх елементів, якщо вони були додані
        document.getElementById('editNewsHtmlContent').innerHTML = '';

        // Перевірка, чи html_content є масивом перед викликом forEach
        if (Array.isArray(news.html_content)) {
            // Додавання параграфів та фотографій з htmlContent
            news.html_content.forEach(element => {
                if (element.tag === 'p') {
                    var paragraph = document.createElement('textarea');
                    paragraph.classList.add('form-control', 'newsParagraph');
                    paragraph.rows = '3';
                    paragraph.value = element.content;
                    document.getElementById('editNewsHtmlContent').appendChild(paragraph);
                } else if (element.tag === 'img') {
                    var photo = document.createElement('img');
                    photo.classList.add('img-fluid', 'mb-3', 'newsPhotoInArticle');
                    photo.src = element.src;
                    photo.alt = 'Uploaded Image';
                    document.getElementById('editNewsHtmlContent').appendChild(photo);
                }
            });
        }

        var myModal = new bootstrap.Modal(document.getElementById('editNewsModal'));
        myModal.show();
    })
    .catch(error => console.error('Помилка:', error));
}

function deleteField(deleteBtn) {
    var element = deleteBtn.parentNode;
    if (element) {
        element.parentNode.removeChild(element);
    }
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