import {sign_out} from "./auth.js"

const url = "https://hypothesis.nordicpine.hackclub.app"

export async function call_api(dict, endpoint, call_method) {
    const options = {
        method: call_method,
        headers: {
            "Content-Type": "application/json"
        }
    }

    const token = localStorage.getItem("token")

    if (token) {
        options.headers["Authorization"] = `Bearer ${token}`
    }

    if (call_method !== "GET") {
        options.body = JSON.stringify(dict)
    }
    
    try {
        const response = await fetch(`${url}${endpoint}`, options)

        if (response.status === 401) {
            sign_out()
            show_message("Your session has expired. Please sign in again to continue", false)

            return {
                ok: false,
                code: 401,
                error: "Session expired"
            }
        }

        const data = await response.json()

        return {
            ok: response.ok,
            code: response.status,
            data: data,
        }
    } catch(error) {
        return {
            code: 0,
            error: "Failed to connect to API."
        }
    }
}

export async function call_api_token(username, password) {
    const form_data = new URLSearchParams()

    form_data.append("username", username)
    form_data.append("password", password)

    try {
        const response = await fetch(`${url}/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: form_data
        })

        const data = await response.json()

        return {
            ok: response.ok,
            code: response.status,
            data: data
        }
    } catch(error) {
        return {
            ok: false,
            code: 0,
            error: "Failed to connect to API."
        }
    }


}

export function show_message(message, status) {
    const overlay = document.getElementById("message-overlay")
    const message_text = overlay.querySelector(".message")
    message_text.textContent = message;

    if (status) {
        message_text.classList.add("green")
        message_text.classList.remove("red")
    } else {
        message_text.classList.remove("green")
        message_text.classList.add("red")
    }
    overlay.classList.add("show")

    setTimeout(function () {
        overlay.classList.remove("show")
     }, 3000)
}

export function add_input(parent, div_class, text_class, button_class) {
    const div = document.createElement("div")
    div.classList.add(div_class)

    const text = document.createElement("input")
    text.type = "text"
    text.classList.add(text_class)
    div.appendChild(text)

    const button = document.createElement("button")
    button.classList.add(button_class)
    button.type = "button"
    button.innerHTML = "&minus;";
    div.appendChild(button)

    parent.appendChild(div)
}

    import {is_logged_in} from "./auth.js"

    export function update_links() {
        const public_links = document.getElementById("public-links")
        const private_links = document.getElementById("private-links")
        const side_menu = document.getElementById("side-menu")

        if (is_logged_in()) {
            public_links.classList.add("hidden")
            private_links.classList.remove("hidden")

            side_menu.innerHTML = `
                <a href = "#/experiments">Experiments</a>
                <a href = "#/experiments/new">+ New experiment</a>
                <a href = "#/account">Account</a>
            `
        } 
        else {
            private_links.classList.add("hidden")
            public_links.classList.remove("hidden") 

            side_menu.innerHTML = `
                <a href = "#/account/signin">Sign in</a>
                <a href = "#/account/signup">Sign up</a>
            `
        }
    }