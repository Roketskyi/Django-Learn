function togglePanel(panelIdToShow, panelIdToHide) {
    var panelToShow = document.getElementById(panelIdToShow);
    var panelToHide = document.getElementById(panelIdToHide);
    
    if (panelToShow.style.opacity === "1") {
        panelToShow.style.opacity = "0";
        panelToShow.style.pointerEvents = "none";
    } else {
        panelToShow.style.opacity = "1";
        panelToShow.style.pointerEvents = "auto";
        panelToHide.style.opacity = "0";
        panelToHide.style.pointerEvents = "none";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            fetch(logoutButton.getAttribute('data-logout-url'), {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'), // Використання CSRF токена з cookies
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({action: 'logout'})
            }).then(response => {
                if (response.ok) {
                    console.log("Logout successful");
                    window.location.reload(true); // Перезавантаження сторінки після виходу
                } else {
                    console.log("Logout failed");
                }
            }).catch(error => console.error('Error:', error));
        });
    }
});

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
