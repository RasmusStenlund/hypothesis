const url = "http://127.0.0.1:8000"

export async function call_api(dict, endpoint, call_method) {
    const options = {
        method: call_method,
        headers: {
            "Content-Type": "application/json"
        }
    }

    if (call_method !== "GET") {
        options.body = JSON.stringify(dict)
    }
    
    const response = await fetch(`${url}${endpoint}`, options)

    const data = await response.json()

    return {
        ok: response.ok,
        code: response.status,
        data: data,
    }
}

export function show_message(message) {
    const overlay = document.getElementById("message-overlay")
    overlay.querySelector(".message").textContent = message;

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