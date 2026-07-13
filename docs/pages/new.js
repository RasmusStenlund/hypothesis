export function page() {
    return `
    <div class = "new">
        <h3 id = "new-header">Create new experiment</h3>

        <form id = "new-experiment-form">
            <div class = "experiment-part">
                <div class = "component">
                    <label>Title</label>
                    <input type = "text" id = "new-title" required>
                </div>

                <div class = "component">
                    <label>Date</label>
                    <input type = "date" id = "new-date" required>
                </div>
            </div>

            <div class = "experiment-part">
                <div class = "component">
                    <label>Contributors</label>
                    <div id = "contributor-list">
                        <div class = "contributor">
                            <input type = "text" class = "new-contributor" required>
                            <button type = "button" class="new-contributor-delete hidden">−</button>
                        </div>
                    </div>
                    <button type = "button" id = "add-contributor">+ Add Contributor</button>
                </div>
            </div>

            <div class = "experiment-part">
                <div class = "component">
                    <label>Introduction</label>
                    <textarea id = "introduction"></textarea>
                </div>

                <div class = "component">
                    <label>Hypothesis</label>
                    <textarea id = "hypothesis" required></textarea>
                </div>

                <div class = "component">
                    <label>Materials</label>
                    <div id = "material-list">
                        <div class = "material">
                            <input type = "text" class = "new-material">
                            <button type = "button" class="new-material-delete hidden">−</button>
                        </div>
                    </div>
                    <button type = "button" id = "add-material">+ Add Material</button>
                </div>

                <div class = "component">
                    <label>Method</label>
                    <textarea id = "method" required></textarea>
                </div>

                <div class = "component">
                    <label>Results</label>
                    <textarea id = "results"></textarea>
                </div>
                
                <div class = "component">
                    <label>Discussion</label>
                    <textarea id = "discussion"></textarea>
                </div>

                <div class = "component">
                    <label>Conclusion</label>
                    <textarea id = "conclusion"></textarea>
                </div>
            </div>

            <div class = "experiment-part">
                <button type = "submit">Create experiment</type>
            </div>
        </form>
    </div>
    `
}

import {call_api, show_message} from "../extra-functions.js"

function add_input(parent, div_class, text_class, button_class) {
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

export function setup() {

    const contributor_list = document.getElementById("contributor-list")
    const add_contributor = document.getElementById("add-contributor")

    add_contributor.addEventListener("click", function () {
        add_input(contributor_list, "contributor", "new-contributor", "new-contributor-delete");
    })

    contributor_list.addEventListener("click", function (event) {
        if (event.target.classList.contains("new-contributor-delete")) {
            event.target.parentElement.remove()
        }
    })

    const material_list = document.getElementById("material-list")
    const add_material = document.getElementById("add-material")

    add_material.addEventListener("click", function () {
        add_input(material_list, "material", "new-material", "new-material-delete")
    })

    material_list.addEventListener("click", function (event) {
        if (event.target.classList.contains("new-material-delete")) {
            event.target.parentElement.remove()
        }
    })

    var textareas = document.querySelectorAll("textarea")

    textareas.forEach(function(textarea) {
        textarea.addEventListener("input", function () {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        })
    })


    const form = document.getElementById("new-experiment-form");
    form.addEventListener("submit", async function(event) {
        event.preventDefault()

        const experiment = {
            title: document.getElementById("new-title").value.trim(),
            date: document.getElementById("new-date").value.trim(),

            contributors: Array.from(
                document.querySelectorAll(".new-contributor")
            ).map(function(input) {
                return input.value.trim()
            }).filter(function(value) {
                return value !== ""
            }),

            introduction: document.getElementById("introduction").value.trim(),
            hypothesis: document.getElementById("hypothesis").value.trim(),

            materials: Array.from(
                document.querySelectorAll(".new-material")
            ).map(function(input) {
                return input.value.trim()
            }).filter(function(value) {
                return value !== ""
            }),

            method: document.getElementById("method").value.trim(),
            results: document.getElementById("results").value.trim(),
            discussion: document.getElementById("discussion").value.trim(),
            conclusion: document.getElementById("conclusion").value.trim()
        }

        data = await call_api(experiment, "/experiments", "POST");
        show_message("test");
    })
}