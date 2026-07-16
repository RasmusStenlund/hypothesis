export function page() {
    return `
    <div id = "experiment-page">
        <div id = "experiment-page-header">
            <h2 id = "experiment-title-text"></h2>
            <input type = "text" id = "experiment-title-input"></input>

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
                    <p class = "experiment-date" id = "experiment-date-text"></p>
                    <input type = "date" id = "experiment-date-input">
                </div>
            </div>

            <div class = "experiment-part">
                <div class = "component">
                    <h3>Contributors</h3>
                    <div id = "experiment-contributors-list"></div>
                    <button type = "button" id = "experiment-add-contributor" class = "hidden">+ Add Contributor</button>
                </div>
            </div>

            <div class = "experiment-part">
                <div class = "component">
                    <h3>Introduction</h3>
                    <p class = "textarea" id = "experiment-introduction-text"></p>
                    <textarea id = "experiment-introduction-input"></textarea>
                </div>

                <div class = "component">
                    <h3>Hypothesis</h3>
                    <p class = "textarea" id = "experiment-hypothesis-text" ></p>
                    <textarea id = "experiment-hypothesis-input"></textarea>
                </div>

                <div class = "component">
                    <h3>Materials</h3>
                    <div id = "experiment-materials-list"></div>
                    <button type = "button" id = "experiment-add-material">+ Add Material</button>
                </div>

                <div class = "component">
                    <h3>Method</h3>
                    <p class = "textarea" id = "experiment-method-text"></p>
                    <textarea id = "experiment-method-input"></textarea>
                </div>

                <div class = "component">
                    <h3>Results</h3>
                    <p class = "textarea" id = "experiment-results-text"></p>
                    <textarea id = "experiment-results-input"></textarea>
                </div>
                
                <div class = "component">
                    <h3>Discussion</h3>
                    <p class = "textarea" id = "experiment-discussion-text"></p>
                    <textarea id = "experiment-discussion-input"></textarea>
                </div>

                <div class = "component">
                    <h3>Conclusion</h3>
                    <p class = "textarea" id = "experiment-conclusion-text"></p>
                    <textarea id = "experiment-conclusion-input"></textarea>
                </div>
            </div>
        </form>

        <div id = "delete-container" class = "hidden">
            <h2 id = "delete-warning"></h2>
            <p>This action cannot be undone.</p>

            <div id = "delete-buttons">
                <button id = "cancel-delete">Cancel</button>
                <button id = "confirm-delete">Delete</button>
            </div>
        </div>
    </div>
    `
} 


import {call_api, show_message, add_input} from "../extra-functions.js"


function make_list(type, data, list) {
    for (const element of data) {
        const container = document.createElement("div")
        container.classList.add(type)
        
        const text = document.createElement("p")
        text.classList.add("experiment-text")
        text.classList.add("text")
        text.textContent = element

        const placeholder = document.createElement("button")
        placeholder.classList.add("remove-placeholder")
        placeholder.disabled = true

        container.appendChild(text)
        container.appendChild(placeholder)
        list.appendChild(container)
    }
}

function list_to_inputs(list, type) {
    const text_elements = list.querySelectorAll(".experiment-text")
    const values = []

    for (const element of text_elements) {
        values.push(element.textContent)
    }
    list.innerHTML = ""

    for (const value of values) {
        add_input(list, type, `edit-${type}`, `remove-${type}`)

        list.lastElementChild.querySelector("input").value = value
    }
}

function hide_elements(type) {
    const element_names = [
        "title",
        "date",
        "introduction",
        "hypothesis",
        "method",
        "results",
        "discussion",
        "conclusion"
    ]

    for (const element_name of element_names) {
        const element = document.getElementById(`experiment-${element_name}-${type}`)
        element.classList.add("hidden")
    }
}

function show_elements(type) {
    const element_names = [
        "title",
        "date",
        "introduction",
        "hypothesis",
        "method",
        "results",
        "discussion",
        "conclusion"
    ]

    for (const element_name of element_names) {
        const element = document.getElementById(`experiment-${element_name}-${type}`)
        element.classList.remove("hidden")
    }
}

function hide_add_buttons() {
    document.getElementById("experiment-add-contributor").classList.add("hidden")
    document.getElementById("experiment-add-material").classList.add("hidden")
}

function show_add_buttons() {
    document.getElementById("experiment-add-contributor").classList.remove("hidden")
    document.getElementById("experiment-add-material").classList.remove("hidden")
}

async function load_experiment(id) {
    const response = await call_api(null, `/experiments/${id}`, "GET")
    const experiment = response.data
    console.log(response.code)

    const title_text = document.getElementById("experiment-title-text")
    title_text.classList.remove("hidden")
    title_text.textContent = experiment.title
    
    const date_text = document.getElementById("experiment-date-text")
    date_text.classList.remove("hidden")
    date_text.textContent = experiment.date

    const introduction_text = document.getElementById("experiment-introduction-text")
    introduction_text.classList.remove("hidden")
    introduction_text.textContent = experiment.introduction

    const hypothesis_text = document.getElementById("experiment-hypothesis-text")
    hypothesis_text.classList.remove("hidden")
    hypothesis_text.textContent = experiment.hypothesis

    const method_text = document.getElementById("experiment-method-text")
    method_text.classList.remove("hidden")
    method_text.textContent = experiment.method

    const results_text = document.getElementById("experiment-results-text")
    results_text.classList.remove("hidden")
    results_text.textContent = experiment.results

    const discussion_text = document.getElementById("experiment-discussion-text")
    discussion_text.classList.remove("hidden")
    discussion_text.textContent = experiment.discussion

    const conclusion_text = document.getElementById("experiment-conclusion-text")
    conclusion_text.classList.remove("hidden")
    conclusion_text.textContent = experiment.conclusion

    const contributors_list = document.getElementById("experiment-contributors-list")
    make_list("contributor", experiment.contributors, contributors_list)

    const materials_list = document.getElementById("experiment-materials-list")
    make_list("material", experiment.materials, materials_list)

    document.getElementById("experiment-title-input").value = experiment.title
    document.getElementById("experiment-date-input").value = experiment.date
    document.getElementById("experiment-introduction-input").value = experiment.introduction
    document.getElementById("experiment-hypothesis-input").value = experiment.hypothesis
    document.getElementById("experiment-method-input").value = experiment.method
    document.getElementById("experiment-results-input").value = experiment.results
    document.getElementById("experiment-discussion-input").value = experiment.discussion
    document.getElementById("experiment-conclusion-input").value = experiment.conclusion
}

function inputs_to_dict() {
    return {
        title: document.getElementById("experiment-title-input").value.trim(),
        date: document.getElementById("experiment-date-input").value.trim(),

        contributors: Array.from(
            document.querySelectorAll(".edit-contributor")
        ).map(function(input) {
            return input.value.trim()
        }).filter(function(value) {
            return value !== ""
        }),

        introduction: document.getElementById("experiment-introduction-input").value.trim(),
        hypothesis: document.getElementById("experiment-hypothesis-input").value.trim(),

        materials: Array.from(
            document.querySelectorAll(".edit-material")
        ).map(function(input) {
            return input.value.trim()
        }).filter(function(value) {
            return value !== ""
        }),

        method: document.getElementById("experiment-method-input").value.trim(),
        results: document.getElementById("experiment-results-input").value.trim(),
        discussion: document.getElementById("experiment-discussion-input").value.trim(),
        conclusion: document.getElementById("experiment-conclusion-input").value.trim()
    }
}

export async function setup(params) {
    hide_elements("input")
    await load_experiment(params.id)

    const edit_button = document.getElementById("edit-experiment")
    const edit_buttons = document.getElementById("experiment-page-edit-buttons")
    const regular_buttons = document.getElementById("experiment-page-actions")

    const contributors_list = document.getElementById("experiment-contributors-list")
    const add_contributor = document.getElementById("experiment-add-contributor")
    add_contributor.addEventListener("click", function () {
        add_input(contributors_list, "contributor", "edit-contributor", "remove-contributor")
    })
    contributors_list.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-contributor")) {
            event.target.parentElement.remove()
        }
    })

    const materials_list = document.getElementById("experiment-materials-list")
    const add_material = document.getElementById("experiment-add-material")
    add_material.addEventListener("click", function () {
        add_input(materials_list, "material", "edit-material", "remove-material")
    })
    materials_list.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-material")) {
            event.target.parentElement.remove()
        }
    })

    const save_edit = document.getElementById("save-edit")
    const cancel_edit = document.getElementById("cancel-edit")

    edit_button.addEventListener("click", function () {
        edit_buttons.classList.remove("hidden")
        regular_buttons.classList.add("hidden")
        list_to_inputs(contributors_list, "contributor")
        list_to_inputs(materials_list, "material")
        hide_elements("text")
        show_elements("input")
        show_add_buttons()
    })

    cancel_edit.addEventListener("click", async function () {
        hide_elements("input")
        show_elements("text")
        hide_add_buttons()

        contributors_list.innerHTML = ""
        materials_list.innerHTML = ""

        await load_experiment(params.id)

        edit_buttons.classList.add("hidden")
        regular_buttons.classList.remove("hidden")
    })

    save_edit.addEventListener("click", async function () {
        const dict = inputs_to_dict();

        const response = await call_api(dict, `/experiments/${params.id}`, "PATCH")

        if (response.code === 200) {
            hide_elements("input")
            show_elements("text")
            hide_add_buttons()

            contributors_list.innerHTML = ""
            materials_list.innerHTML = ""

            await load_experiment(params.id)

            edit_buttons.classList.add("hidden")
            regular_buttons.classList.remove("hidden")
            show_message("Sucessfully edited experiment!", true)
        } else {
            show_message("Failed to edit experiment.", false)
        }
    })

    const delete_button = document.getElementById("delete-experiment")
    const delete_container = document.getElementById("delete-container")
    const cancel_delete = document.getElementById("cancel-delete")
    const confirm_delete = document.getElementById("confirm-delete")
    const warning = document.getElementById("delete-warning")
    const title = document.getElementById("experiment-title-text").textContent

    delete_button.addEventListener("click", function () {
        warning.textContent = `Are you sure you want to delete "${title}"?`
        delete_container.classList.remove("hidden")
    })

    cancel_delete.addEventListener("click", function () {
        delete_container.classList.add("hidden")
    })

    confirm_delete.addEventListener("click", async function () {
        const delete_response = await call_api(null, `/experiments/${params.id}`, "DELETE")
        if (delete_response.code === 200) {
            window.location.hash = "#/experiments"
            show_message("Experiment successfully deleted!", true)
        } else {
            show_message("Failed to delete experiment.", false)
        }
    })
}