// settings_profile.js
document.getElementById("changeLoginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Зупиняємо стандартну подію подачі форми

    var userId = this.getAttribute("data-user-id");
    var newLogin = document.getElementById("newLogin").value;

    fetch('/update-login/' + userId + '/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ login: newLogin })
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
