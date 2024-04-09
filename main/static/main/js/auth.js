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
