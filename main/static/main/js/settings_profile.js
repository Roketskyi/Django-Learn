function previewProfileImage(event) {
    var profileImgPreview = document.getElementById('profileImgPreview');
    profileImgPreview.src = URL.createObjectURL(event.target.files[0]);
    document.getElementById('saveProfileImgBtn').style.display = 'block'; // Показати кнопку "Зберегти фотографію"
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("updateAvatarForm").addEventListener("submit", function(event) {
        event.preventDefault();
        
        var formData = new FormData();
        formData.append('avatar', document.getElementById('avatar').files[0]);

        fetch('/settings-profile/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                swal("Успішно!", data.success, "success").then(() => {
                    window.location.href = data.redirect; // Перенаправляємо користувача на поточну сторінку
                });
            } else {
                swal("Помилка!", data.error, "error");
            }
        })
        .catch(error => {
            swal("Помилка!", "Помилка під час відправлення запиту", "error");
            console.error('Помилка під час відправлення запиту:', error);
        });
    });

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
});
