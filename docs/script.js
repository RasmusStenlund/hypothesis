import {setup_menu} from "./pages/menu.js"
setup_menu()

import * as sign_in from "./pages/signin.js"
import * as sign_up from "./pages/signup.js"

import * as home from "./pages/home.js"
import * as experiments from "./pages/experiments.js"
import * as new_experiment from "./pages/new.js"
import * as experiment from "./pages/experiment.js"
import * as account from "./pages/account.js"

import {is_logged_in} from "./auth.js"
import {update_links} from "./extra-functions.js"

const public_routes = {
    '#/': home,
    '#/account/signin': sign_in,
    '#/account/signup': sign_up
}


const private_routes = {
    '#/': home,
    '#/experiments': experiments,
    '#/experiments/new': new_experiment,
    '#/account': account
}

function router() {
    update_links()

    const current_hash = window.location.hash || '#/';

    const link_list = document.querySelectorAll(".links a, #side-menu a")
    for (const link of link_list) {
        if (link.getAttribute("href") === current_hash) {
            link.classList.add("selected")
        } else {
            link.classList.remove("selected")
        }
    }


    let content_function = {...public_routes, ...private_routes}[current_hash]
    let app_container = document.getElementById('app')
    let params = {}

    if (private_routes[current_hash] && !(is_logged_in()) && current_hash !== '#/') {
        window.location.hash = '#/'
        return
    }

    if (public_routes[current_hash] && is_logged_in()) {
        window.location.hash = '#/'
    }

    if (current_hash.startsWith('#/experiments/') && !(is_logged_in())) {
        window.location.hash = '#/'
        return
    }

    if (current_hash.startsWith('#/experiments/') && current_hash !== '#/experiments/new') {
        params.id = current_hash.split('/')[2]
        content_function = experiment
    }

    if (content_function) {
        app_container.innerHTML = content_function.page();

        if (content_function.setup) {
            content_function.setup(params);
        }
    } else {
        app_container.innerHTML = `
            <div class = "not-found">
                <h1>404</h1>
                <p>Page not found</p>
            </div>
        `
    }
}

window.addEventListener("hashchange", router)
window.addEventListener("load", router)