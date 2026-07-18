export function page() {
    return `
    <div id = "new">
        <h1 id = "new-header">Create new experiment</h1>

        <form id = "new-experiment-form">
            <div class = "experiment-part">
                <div class = "component">
                    <h3>Title</h3>
                    <input type = "text" id = "new-title" required>
                </div>

                <div class = "component">
                    <h3>Date</h3>
                    <input type = "date" id = "new-date" required>
                </div>
            </div>

            <div class = "experiment-part">
                <div class = "component">
                    <h3>Contributors</h3>
                    <div id = "contributor-list">
                        <div class = "contributor">
                            <input type = "text" class = "new-contributor" required>
                            <button type = "button" class="remove-contributor opacity">−</button>
                        </div>
                    </div>
                    <button type = "button" id = "new-add-contributor">+ Add Contributor</button>
                </div>
            </div>

            <div class = "experiment-part">
                <div class = "component">
                    <h3>Introduction</h3>
                    <textarea id = "new-introduction"></textarea>
                </div>

                <div class = "component">
                    <h3>Hypothesis</h3>
                    <textarea id = "new-hypothesis" required></textarea>
                </div>

                <div class = "component">
                    <h3>Materials</h3>
                    <div id = "material-list">
                        <div class = "material">
                            <input type = "text" class = "new-material">
                            <button type = "button" class="remove-material opacity">−</button>
                        </div>
                    </div>
                    <button type = "button" id = "new-add-material">+ Add Material</button>
                </div>

                <div class = "component">
                    <h3>Method</h3>
                    <textarea id = "new-method" required></textarea>
                </div>

                <div class = "component">
                    <h3>Results</h3>
                    <textarea id = "new-results"></textarea>
                </div>
                
                <div class = "component">
                    <h3>Discussion</h3>
                    <textarea id = "new-discussion"></textarea>
                </div>

                <div class = "component">
                    <h3>Conclusion</h3>
                    <textarea id = "new-conclusion"></textarea>
                </div>
            </div>

            <div class = "experiment-part">
                <button type = "submit">Create experiment</type>
            </div>
        </form>
    </div>
    `
}

import {call_api, show_message, add_input} from "../extra-functions.js"

export function setup() {

    const contributor_list = document.getElementById("contributor-list")
    const add_contributor = document.getElementById("new-add-contributor")

    add_contributor.addEventListener("click", function () {
        add_input(contributor_list, "contributor", "new-contributor", "remove-contributor");
    })

    contributor_list.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-contributor")) {
            event.target.parentElement.remove()
        }
    })

    const material_list = document.getElementById("material-list")
    const add_material = document.getElementById("new-add-material")

    add_material.addEventListener("click", function () {
        add_input(material_list, "material", "new-material", "remove-material")
    })

    material_list.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-material")) {
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

            introduction: document.getElementById("new-introduction").value.trim(),
            hypothesis: document.getElementById("new-hypothesis").value.trim(),

            materials: Array.from(
                document.querySelectorAll(".new-material")
            ).map(function(input) {
                return input.value.trim()
            }).filter(function(value) {
                return value !== ""
            }), 

            method: document.getElementById("new-method").value.trim(),
            results: document.getElementById("new-results").value.trim(),
            discussion: document.getElementById("new-discussion").value.trim(),
            conclusion: document.getElementById("new-conclusion").value.trim()
        }

        const data = await call_api(experiment, "/experiments", "POST");
        if (data.ok) {
            window.location.hash = '#/experiments'
            show_message("Successfully created experiment!", true);
        } else {
            show_message("Failed to create experiment", false)
        }
    })
}