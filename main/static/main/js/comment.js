document.addEventListener('DOMContentLoaded', function() {
    var deleteFields = document.querySelectorAll('.delete-field');
    deleteFields.forEach(function(field) {
        field.addEventListener('click', function(event) {
            event.preventDefault();
            var commentId = field.dataset.commentId; // Отримання значення commentId з dataset поля
            deleteComment(commentId);
        });
    });

    var likeBtns = document.querySelectorAll('.like-btn');
    likeBtns.forEach(function(btn) {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            var commentId = btn.dataset.commentId; // Отримання значення commentId з dataset кнопки
            updateLikes(commentId, btn); // Передача кнопки в якості аргументу для оновлення класу active
        });
    });

    var dislikeBtns = document.querySelectorAll('.dislike-btn');
    dislikeBtns.forEach(function(btn) {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            var commentId = btn.dataset.commentId; // Отримання значення commentId з dataset кнопки
            updateDislikes(commentId, btn); // Передача кнопки в якості аргументу для оновлення класу active
        });
    });

    var replyBtns = document.querySelectorAll('.reply-btn');
    replyBtns.forEach(function(btn) {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            var commentId = btn.dataset.commentId; // Отримання ID коментаря
            var commenterName = btn.closest('.comment-card').querySelector('.card-title').textContent; // Отримання імені коментатора
            var commentForm = document.getElementById('comment-form');
            var commentContent = commentForm.querySelector('#comment-content');
            
            // Додавання відповіді у текстове поле коментаря з вказанням імені коментатора
            commentContent.value = `@${commenterName}, `;
            
            // Додавання схованого поля для збереження ID батьківського коментаря
            var parentCommentIdInput = document.createElement('input');
            parentCommentIdInput.type = 'hidden';
            parentCommentIdInput.name = 'parent_comment_id';
            parentCommentIdInput.value = commentId;
            commentForm.appendChild(parentCommentIdInput);
        });
    });

    var commentForm = document.getElementById('comment-form');
    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(commentForm);
        var newsId = window.location.pathname.split('/')[2];
        addComment(formData, newsId);
    });
});

function addComment(formData, newsId) {
    formData.append('csrfmiddlewaretoken', getCookie('csrftoken')); // Додайте CSRF токен до formData
    fetch(`/news/${newsId}/add-comment/`, {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            window.location.reload();
        } else if (response.status === 401) {
            throw new Error('Потрібно авторизуватись, щоб залишити коментар.');
        } else {
            throw new Error('Виникла помилка при додаванні коментаря.');
        }
    })
    .catch(error => {
        console.error('Помилка:', error);
        swal("Помилка!", error.message, "error");
    });
}

function deleteComment(commentId) {
    fetch(`/delete-comment/${commentId}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Виникла помилка при видаленні коментаря.');
        }
    })
    .then(data => {
        swal("Успіх!", data.success, "success");
        var deletedComment = document.querySelector(`.delete-field[data-comment-id="${commentId}"]`).closest('.card'); // Find the closest ancestor with the specified class
        deletedComment.remove();
    })
    .catch(error => {
        console.error('Помилка:', error);
        swal("Помилка!", error.message, "error");
    });
}

function updateLikes(commentId, btn) {
    fetch(`/update-likes/${commentId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 401) {
            throw new Error('Потрібно увійти, щоб реагувати на коментарі.');
        } else {
            throw new Error('Виникла помилка при оновленні лайків.');
        }
    })
    .then(data => {
        var likesCount = btn.querySelector('.likes-count');
        var dislikesCount = btn.parentNode.querySelector('.dislikes-count');
        likesCount.textContent = data.likes;
        dislikesCount.textContent = data.dislikes;

        // Оновлення класу active
        btn.classList.toggle('active');

        // Видалення класу active з кнопки дизлайка, якщо він вже був натиснутий
        var dislikeBtn = btn.parentNode.querySelector('.dislike-btn');
        dislikeBtn.classList.remove('active');
    })
    .catch(error => {
        console.error('Помилка:', error);
        swal("Помилка!", error.message, "error");
    });
}

function updateDislikes(commentId, btn) {
    fetch(`/update-dislikes/${commentId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 401) {
            throw new Error('Потрібно увійти, щоб реагувати на коментарі.');
        } else {
            throw new Error('Виникла помилка при оновленні дизлайків.');
        }
    })
    .then(data => {
        var likesCount = btn.parentNode.querySelector('.likes-count');
        var dislikesCount = btn.querySelector('.dislikes-count');
        likesCount.textContent = data.likes;
        dislikesCount.textContent = data.dislikes;

        // Оновлення класу active
        btn.classList.toggle('active');

        // Видалення класу active з кнопки лайка, якщо він вже був натиснутий
        var likeBtn = btn.parentNode.querySelector('.like-btn');
        likeBtn.classList.remove('active');
    })
    .catch(error => {
        console.error('Помилка:', error);
        swal("Помилка!", error.message, "error");
    });
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