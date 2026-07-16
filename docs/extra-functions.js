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
    
    try {
        const response = await fetch(`${url}${endpoint}`, options)

        const data = await response.json()

        return {
            ok: response.ok,
            code: response.status,
            data: data,
        }
    } catch(error) {
        return {
            code: 0,
            error: "Failed to conenct to API."
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