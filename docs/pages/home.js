export function page() {
    return `
    <div id = "home">
        <div id = "public-home">
            <div id = "home-logo">
                <img class = "icon" src = "./images/hypothesis-icon.png" alt = "Hypothesis icon">
                <h1 class = "hypothesis">Welcome to Hypothesis!</h1>
            </div>
            <div class = "home-part">
                <h2>Organize your scientific experiments.</h2>
                <p>Create, document, edit and remove your experiments from hypothesis to conclusion - All in one place.</p>

                <div id = "home-public-buttons">
                    <button id = "home-get-started">Get started</button>
                    <button id = "home-sign-in">Sign in</button>
                </div>
            </div>
        </div>
        <div id = "private-home">
            <h1 id = "home-welcome"></h1>

            <div class = "home-part">
                <h3>Document your next experiment</h3>
                <button id = "home-new">+ New experiment</button>
            </div>

            <div class = "home-part">
                <h3>Other pages</h3>
                <button id = "home-experiments">View experiments</button>
                <button id = "home-account">Account</button>
            </div>
        </div>
    </div>
    `
}

import {call_api} from "../extra-functions.js"
import {is_logged_in} from "../auth.js"

export async function setup() {
    const public_page = document.getElementById("public-home")
    const private_page = document.getElementById("private-home")

    if (is_logged_in()) {
        public_page.classList.add("hidden")
        private_page.classList.remove("hidden")

        const welcome = document.getElementById("home-welcome")

        const response = await call_api(null, "/users/me", "GET")

        if (response.ok) {
            welcome.textContent = `Welcome back, ${response.data.display_name}`

            const add_experiment = document.getElementById("home-new")
            add_experiment.addEventListener("click", function () {
                window.location.hash = "#/experiments/new"
            })

            const experiments = document.getElementById("home-experiments")
            experiments.addEventListener("click", function () {
                window.location.hash = "#/experiments"
            })

            const account = document.getElementById("home-account")
            account.addEventListener("click", function () {
                window.location.hash = "#/account"
            })
        }

    } else {
        private_page.classList.add("hidden")
        public_page.classList.remove("hidden")

        const get_started = document.getElementById("home-get-started")
        get_started.addEventListener("click", function () {
            window.location.hash = "#/account/signup"
        })

        const sign_in = document.getElementById("home-sign-in")
        sign_in.addEventListener("click", function () {
            window.location.hash = "#/account/signin"
        })
    }

}