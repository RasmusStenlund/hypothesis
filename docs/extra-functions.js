const url = "http://127.0.0.1:8000"

export async function call_api(dict, endpoint, call_method) {
    const response = await fetch(`${url}${endpoint}`, {
        method: call_method,
        body: JSON.stringify(dict),
        headers: {
            "Content-Type": "application/json"
        }
    })

    const data = await response.json()

    return {
        ok: response.ok,
        code: response.status,
        data: data,
    }
}

export function show_message(message) {
    const overlay = document.getElementById("#message-overlay")
    overlay.querySelector(".message").textContent = message;

    overlay.classList.add("show")

    setTimeout(function () {
        overlay.classList.remove("show")
     }, 5000)
}