document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("changeLoginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Зупиняємо стандартну подію подачі форми

    var userId = this.getAttribute("data-user-id");
    var newLogin = document.getElementById("newLogin").value;

    fetch('/update-login/' + userId + '/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Змінено Content-Type
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: 'login=' + encodeURIComponent(newLogin) // Дані у форматі 'key=value'
    })
    .then(response => {
        if (response.ok) {
            // Опрацювання успішної відповіді, якщо потрібно
            console.log('Логін успішно оновлено');
        } else {
            // Опрацювання помилки, якщо потрібно
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
})