document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("changeLoginForm").addEventListener("submit", function(event) {
        event.preventDefault();

        var userId = this.getAttribute("data-user-id");
        var newLogin = document.getElementById("newLogin").value;

        fetch('/update-login/' + userId + '/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: 'login=' + encodeURIComponent(newLogin)
        })
        .then(response => {
            if (response.ok) {
                console.log('Логін успішно оновлено');
            } else {
                console.error('Помилка оновлення логіну');
            }
        })
        .catch(error => {
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

function previewProfileImage(event) {
    var profileImgPreview = document.getElementById('profileImgPreview');
    profileImgPreview.src = URL.createObjectURL(event.target.files[0]);
}
