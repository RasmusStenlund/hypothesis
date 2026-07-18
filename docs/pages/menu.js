export function setup_menu() {
    const button = document.getElementById("menu-button")
    const menu = document.getElementById("side-menu")
    const icon = document.getElementById("menu-icon")

    function close_menu() {
        menu.classList.remove("open")
        icon.classList.remove("fa-xmark")
        icon.classList.add("fa-bars")
    }

    button.addEventListener("click", function () {
        menu.classList.toggle("open")

        if (menu.classList.contains("open")) {
            icon.classList.remove("fa-bars")
            icon.classList.add("fa-xmark")
        } else {
            icon.classList.remove("fa-xmark")
            icon.classList.add("fa-bars")
        }
    })

    window.addEventListener("resize", function () {
        if (window.innerWidth > 500) {
            close_menu()
        }
    })

    menu.addEventListener("click", function (event) {
        const clicked_element = event.target

        if (clicked_element.matches("a")) {
            close_menu()
        }
    })

    document.addEventListener("click", function (event) {
        const is_menu = menu.contains(event.target)
        const is_button = button.contains(event.target)

        if (!(is_menu) && !(is_button)) {
            close_menu()   
        }
    })
}