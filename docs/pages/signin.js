export function page() {
    return `
    <div id = "sign-in">
        <h1>Sign in</h1>
        <p id = "sign-in-description">
            Don't have an account?
            <a href = "#/account/signup">Sign up</a>
        </p>
        <form id = "sign-in-form">
            <div class = "sign-in-part">
                <label for = "sign-in-username">Username</label>
                <input id = "sign-in-username" type = "text" name = "username" autocomplete = "username" required>
                <label for = "sign-in-password">Password</label>
                <input id = "sign-in-password" type = "password" name = "password" autocomplete = "current-password" required>
            </div>

            <div class = "sign-in-part">
                <button type = "submit">Sign in</button>
            </div>
        </form>
    </div>
    `
}

import {call_api_token, show_message} from "../extra-functions.js"
import {save_token} from "../auth.js"

export function setup() {
    const form = document.getElementById("sign-in-form")

    form.addEventListener("submit", async function (event) {
        event.preventDefault()

        const data = new FormData(form)
        const username = data.get("username").trim()
        const password = data.get("password")

        const token_response = await call_api_token(username, password)

        if (token_response.ok) {
            save_token(token_response.data.access_token)
            show_message("Successfully signed in!", true)
            window.location.hash = "#/"
        } else {
            show_message("Wrong username or password.", false)
        }
    })
}