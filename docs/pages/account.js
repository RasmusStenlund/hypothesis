export function page() {
    return `
    <div id = "account-page">
        <div class = "account-part">
            <p id = "account-display-name"></p>
            <p id = "account-username"></p>
            <p id = "account-email"></p>
        </div>
        
        <div class = "account-part">
            <p id = "account-experiments"></p>
        </div>
        <button id = "sign-out-button">Sign out</button>
    </div>
    `
}

import {call_api, show_message} from "../extra-functions.js"
import {sign_out} from "../auth.js"

export async function setup() {
    const user_response = await call_api(null, "/users/me", "GET")
    const experiment_response = await call_api(null, "/experiments", "GET")

    if (user_response.ok && experiment_response.ok) {
        const user = user_response.data
        const experiment_count = experiment_response.data.length
        const experiment_p = document.getElementById("account-experiments")

        if (experiment_count === 1) {
            experiment_p.textContent = `${experiment_count} Experiment`
        } else {
            experiment_p.textContent = `${experiment_count} Experiments`
        }

        document.getElementById("account-display-name").textContent = user.display_name
        document.getElementById("account-username").textContent = `@ ${user.username}`
        document.getElementById("account-email").textContent = `✉ ${user.email}`
        

        const sign_out_button = document.getElementById("sign-out-button")
        sign_out_button.addEventListener("click", function () {
            sign_out()
            show_message("Successfully signed out!", true)
        })
    }
}