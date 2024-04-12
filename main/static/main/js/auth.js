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
    document.querySelectorAll('.close').forEach(function(closeButton) {
        closeButton.addEventListener('click', function() {
            var panel = this.parentElement;
            panel.style.opacity = "0";
            panel.style.pointerEvents = "none";
        });
    });

    document.addEventListener('click', function(event) {
        var openedPanels = document.querySelectorAll('.panel[style*="opacity: 1"]');
        if (openedPanels.length > 0 && !event.target.closest('.panel') && !event.target.closest('.text-end')) {
            openedPanels.forEach(function(panel) {
                panel.style.opacity = "0";
                panel.style.pointerEvents = "none";
            });
        }
    });

    var logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            fetch(logoutButton.getAttribute('data-logout-url'), {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'), // Читання CSRF токена з кукі
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({action: 'logout'})
            }).then(response => response.json())
            .then(data => {
                console.log('Logout successful:', data);
                window.location.href = '/'; // Оновлення сторінки після виходу
            }).catch(error => console.error('Error:', error));
        });
    }
});

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = cookie.substring(name.length + 1);
                break;
            }
        }
    }
    return cookieValue;
}

