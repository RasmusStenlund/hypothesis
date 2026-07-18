export function page() {
    return `
    <div id = "account-page">
        <p id = "account-display-name"></p>
        <p id = "account-username"></p>
        <p id = "account-email"></p>
        <button id = "sign-out-button">Sign out</button>
    </div>
    `
}

import {call_api, show_message} from "../extra-functions.js"
import {sign_out} from "../auth.js"

export async function setup() {
    const response = await call_api(null, "/users/me", "GET")

    if (response.ok) {
        const user = response.data

        document.getElementById("account-display-name").textContent = user.display_name
        document.getElementById("account-username").textContent = user.username
        document.getElementById("account-email").textContent = user.email

        const sign_out_button = document.getElementById("sign-out-button")
        sign_out_button.addEventListener("click", function () {
            sign_out()
            show_message("Successfully signed out!", true)
        })
    }
}