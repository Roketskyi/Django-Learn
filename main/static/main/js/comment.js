document.addEventListener('DOMContentLoaded', function() {

    var deleteFields = document.querySelectorAll('.delete-field');

    deleteFields.forEach(function(field) {
        field.addEventListener('click', function(event) {
            var commentId = event.target.dataset.commentId;
            deleteComment(commentId);
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
