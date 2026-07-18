export function page() {
    return `
    <div id = "sign-up">
        <h1>Create account</h1>
        <p id = "sign-up-description">
            Already have an account?
            <a href = "#/account/signin">Sign in</a>
        </p>
        <form id = "sign-up-form">
            <label for = "sign-up-display_name">Display name</label>
            <input id = "sign-up-display_name" type = "text" name = "display_name" required>

            <label for = "sign-up-username">Username</label>
            <input id = "sign-up-username" type = "text" name = "username" autocomplete = "username" required>

            <label for = "sign-up-email">Email</label>
            <input id = "sign-up-email" type = "email" name = "email" autocomplete = "email" required>

            <label for = "sign-up-password">Password</label>
            <input id = "sign-up-password" type = "password" name = "password" autocomplete = "new-password" required>

            <label for = "sign-up-confirm">Confirm password</label>
            <input id = "sign-up-confirm" type = "password" name = "confirm_password" autocomplete = "new-password" required>

            <button type = "submit">Sign up</button>
        </form>
    </div>
    `
}

import {call_api, call_api_token, show_message} from "../extra-functions.js"
import {save_token} from "../auth.js"

export function setup() {
    const form = document.getElementById("sign-up-form")

    form.addEventListener("submit", async function (event) {
        event.preventDefault()
        
        const data = new FormData(form)
        const display_name = data.get("display_name").trim()
        const username = data.get("username").trim()
        const email = data.get("email").trim()
        const password = data.get("password")
        const confirm_password = data.get("confirm_password")

        if (username.length < 3) {
            show_message("Username must be at least 3 characters long")
            return
        }

        if (password.length < 8) {
            show_message("Password must be at least 8 characters long")
            return
        }

        if (password !== confirm_password) {
            show_message("Passwords do not match", false)
            return
        }

        const user = {
            username: username,
            display_name: display_name,
            email: email,
            password: password,
        }

        const response = await call_api(user, "/users", "POST")

        if (response.ok) {

            const token_response = await call_api_token(username, password)
            
            if (token_response.ok) {
                const token = token_response.data.access_token

                save_token(token)

                show_message(`Account successfully created! Welcome ${display_name}`, true)
                window.location.hash = "#/"
            } else {
                show_message("Account created, but login failed.", false)
            }

        } else {
            show_message("Failed to create account.", false)
        }
    })
}