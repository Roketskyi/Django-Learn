
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
