<<<<<<< HEAD
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

=======
document.addEventListener('DOMContentLoaded', function() {
    var loginButton = document.getElementById('loginButton');
    var registerButton = document.getElementById('registerButton');
    var closeLoginButton = document.getElementById('closeLoginPanel');
    var closeRegisterButton = document.getElementById('closeRegisterPanel');
    
    loginButton.addEventListener('click', function() {
        var loginPanel = document.getElementById('loginPanel');
        closeAllPanels(); // Закриваємо всі панелі перед відкриттям нової
        loginPanel.style.opacity = "1";
        loginPanel.style.pointerEvents = "auto";
    });
    
    registerButton.addEventListener('click', function() {
        var registerPanel = document.getElementById('registerPanel');
        closeAllPanels(); // Закриваємо всі панелі перед відкриттям нової
        registerPanel.style.opacity = "1";
        registerPanel.style.pointerEvents = "auto";
    });
    
    closeLoginButton.addEventListener('click', function() {
        var loginPanel = document.getElementById('loginPanel');
        loginPanel.style.opacity = "0";
        loginPanel.style.pointerEvents = "none";
    });
    
    closeRegisterButton.addEventListener('click', function() {
        var registerPanel = document.getElementById('registerPanel');
        registerPanel.style.opacity = "0";
        registerPanel.style.pointerEvents = "none";
    });

    var registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Зупинити стандартну подію відправки форми

        var email = document.getElementById('registerEmail').value;
        var password = document.getElementById('registerPassword').value;
        var confirmPassword = document.getElementById('confirmPassword').value;

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    alert('Реєстрація успішна!');
                } else {
                    console.error('Помилка: ' + xhr.status);
                }
            }
        };
        xhr.open('POST', '/register_user/');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ email: email, password: password, confirmPassword: confirmPassword }));
    });

    var loginSubmitButton = document.querySelector('#loginPanel button');
    loginSubmitButton.addEventListener('click', function() {
        var username = document.querySelector('#loginPanel input[type="text"]').value;
        var password = document.querySelector('#loginPanel input[type="password"]').value;

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    document.getElementById('loginPanel').style.opacity = "0";
                    document.getElementById('loginPanel').style.pointerEvents = "none";
                    document.getElementById('registerButton').style.display = "none";
                    document.getElementById('loginButton').style.display = "none";
                    document.getElementById('userInfo').innerText = "Вітаю, " + response.email;
                    document.getElementById('userInfo').style.display = "inline";
                } else {
                    console.error('Помилка: ' + xhr.status);
                }
            }
        };
        xhr.open('POST', '/login_user/');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ username: username, password: password }));
    });

    function closeAllPanels() {
        var panels = document.querySelectorAll('.panel');
        panels.forEach(function(panel) {
            panel.style.opacity = "0";
            panel.style.pointerEvents = "none";
        });
    }
    
    // Додано виклики функції closeAllPanels() перед відкриттям відповідних панелей
    registerButton.addEventListener('click', function() {
        closeAllPanels();
    });
    
    loginButton.addEventListener('click', function() {
        closeAllPanels();
    });
});
>>>>>>> 626a9bbd3da842292e64084b620f2df2e8d3aa0e
