export function page() {
    return `
    <div class = "new">
        <p>New experiment</p>

        <form id = "new-experiment-form">
            <label>Title</label>
            <input type = "text" id = "new-title">

            <label>Date</label>
            <input type = "date" id = "new-date">

            <label>Contributors</label>
            <div id = "contributor-list">
                <div class = "contributor">
                    <input type = "text" class = "new-contributor">
                </div>
            </div>
            <button id = "add-contributor">+ Add Contributor</button>

            <label>Introduction</label>
            <textarea id = "introduction"></textarea>

            <label>Hypothesis</label>
            <textarea id = "hypothesis"></textarea>

            <label>Materials</label>
            <div id = "material-list">
                <div class = "material">
                    <input type = "text" class = "new-material">
                </div>
            </div>
            <button id = "add-material">+ Add Material</button>

            <label>Method</label>
            <textarea id = "method"></textarea>

            <label>Results</label>
            <textarea id = "results"></textarea>

            <label>Discussion</label>
            <textarea id = "discussion"></textarea>

            <label>Conclusion</label>
            <textarea id = "conclusion"></textarea>

            <button type = "submit">Submit</type>
        </form>
    </div>
    `
}

function add_input(parent, div_class, text_class, button_class) {
    const div = document.createElement("div")
    div.classList.add(div_class)

    const text = document.createElement("input")
    text.type = "text"
    text.classList.add(text_class)
    div.appendChild(text)

    const button = document.createElement("button")
    button.classList.add(button_class)
    button.textContent = "X"
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
}