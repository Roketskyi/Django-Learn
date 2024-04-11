function togglePanel(panelIdToShow, panelIdToHide) {
    var panelToShow = document.getElementById(panelIdToShow);
    var panelToHide = document.getElementById(panelIdToHide);
    
    // Перевірка, чи панель, яку ви хочете показати, вже видима
    if (panelToShow.style.opacity === "1") {
        // Якщо вже видима, то змінюємо тільки панель, яку хочемо приховати
        panelToShow.style.opacity = "0";
        panelToShow.style.pointerEvents = "none";
    } else {
        // Якщо не видима, то змінюємо видимість обох панелей
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

    // Додамо обробник події для закриття панелей при кліку ззовні
    document.addEventListener('click', function(event) {
        var openedPanels = document.querySelectorAll('.panel[style*="opacity: 1"]');
        if (openedPanels.length > 0 && !event.target.closest('.panel') && !event.target.closest('.text-end')) {
            openedPanels.forEach(function(openedPanel) {
                openedPanel.style.opacity = "0";
                openedPanel.style.pointerEvents = "none";
            });
        }
    });
});