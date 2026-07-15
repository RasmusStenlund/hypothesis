export function page() {
    return `
    <div id = "experiment-page">
        <div id = "experiment-page-header">
            <h2 id = "experiment-page-title"></h2>

            <div id = "experiment-page-actions">
                <button id = "edit-experiment">Edit</button>
                <button id = "delete-experiment">Delete</button>
            </div>
            <div id = "experiment-page-edit-buttons" class = "hidden">
                <button id = "cancel-edit">Cancel</button>
                <button id = "save-edit">Save</button>
            </div>
        </div>

         <form id = "experiment-page-form">
            <div class = "experiment-part">
                <div class = "component">
                    <h3>Date</h3>
                    <p class = "experiment-date" id = "experiment-page-date"></p>
                </div>
            </div>

            <div class = "experiment-part">
                <div class = "component">
                    <h3>Contributors</h3>
                    <div id = "experiment-page-contributor-list"></div>
                </div>
            </div>

            <div class = "experiment-part">
                <div class = "component">
                    <h3>Introduction</h3>
                    <p class = "experiment-text textarea" id = "experiment-page-introduction"></p>
                </div>

                <div class = "component">
                    <h3>Hypothesis</h3>
                    <p class = "experiment-text textarea" id = "experiment-page-hypothesis" ></p>
                </div>

                <div class = "component">
                    <h3>Materials</h3>
                    <div id = "experiment-page-material-list"></div>
                </div>

                <div class = "component">
                    <h3>Method</h3>
                    <p class = "experiment-text textarea" id = "experiment-page-method"></p>
                </div>

                <div class = "component">
                    <h3>Results</h3>
                    <p class = "experiment-text textarea" id = "experiment-page-results"></p>
                </div>
                
                <div class = "component">
                    <h3>Discussion</h3>
                    <p class = "experiment-text textarea" id = "experiment-page-discussion"></p>
                </div>

                <div class = "component">
                    <h3>Conclusion</h3>
                    <p class = "experiment-text textarea" id = "experiment-page-conclusion"></p>
                </div>
            </div>
        </form>

        <div id = "delete-container" class = "hidden">
            <h2 id = "delete-warning"></h2>
            <p>This action cannot be undone.

            <div id = "delete-buttons">
                <button id = "cancel-delete">Cancel</button>
                <button id = "confirm-delete">Delete</button>
            </div>
        </div>
    </div>
    `
} 
function make_list(type, data, list) {
    for (const element of data) {
        const container = document.createElement("div")
        container.classList.add(type)
        
        const text = document.createElement("p")
        text.classList.add("experiment-text")
        text.textContent = element

        container.appendChild(text)
        list.appendChild(container)
    }
}

function replace_text() {
    const text_elements = document.querySelectorAll(".textarea")

    for (const text of text_elements) {
        const input = document.createElement("textarea")
        input.value = text.textContent

        text.replaceWith(input)

    }

}

import {call_api, show_message} from "../extra-functions.js"

export async function setup(params) {
    const response = await call_api(null, `/experiments/${params.id}`, "GET")
    const experiment = response.data

    document.getElementById("experiment-page-title").textContent = experiment.title
    document.getElementById("experiment-page-date").textContent = experiment.date

    const contributors_list = document.getElementById("experiment-page-contributor-list")
    const contributors_data = experiment.contributors
    make_list("contributor", contributors_data, contributors_list)

    document.getElementById("experiment-page-introduction").textContent = experiment.introduction
    document.getElementById("experiment-page-hypothesis").textContent = experiment.hypothesis

    const materials_list = document.getElementById("experiment-page-material-list")
    const materials_data = experiment.materials
    make_list("material", materials_data, materials_list)

    document.getElementById("experiment-page-method").textContent = experiment.method
    document.getElementById("experiment-page-results").textContent = experiment.results
    document.getElementById("experiment-page-discussion").textContent = experiment.discussion
    document.getElementById("experiment-page-conclusion").textContent = experiment.conclusion

    const edit_button = document.getElementById("edit-experiment")
    const edit_buttons = document.getElementById("experiment-page-edit-buttons")
    const regular_buttons = document.getElementById("experiment-page-actions")
    edit_button.addEventListener("click", function () {
        replace_text();
        regular_buttons.classList.add("hidden")
        edit_buttons.classList.remove("hidden")
    })

    const delete_button = document.getElementById("delete-experiment")
    const delete_container = document.getElementById("delete-container")
    const cancel_delete = document.getElementById("cancel-delete")
    const confirm_delete = document.getElementById("confirm-delete")
    const warning = document.getElementById("delete-warning")

    delete_button.addEventListener("click", function () {
        warning.textContent = `Are you sure you want to delete "${experiment.title}"?`
        delete_container.classList.remove("hidden")
    })

    cancel_delete.addEventListener("click", function () {
        delete_container.classList.add("hidden")
    })

    confirm_delete.addEventListener("click", async function () {
        const delete_response = await call_api(null, `/experiments/${params.id}`, "DELETE")
        if (delete_response.code === 200) {
            window.location.hash = "#/experiments"
            show_message("Experiment successfully deleted!")
        }
    })


}