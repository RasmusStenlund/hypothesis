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
                    <input type = "button" class = "new-contributor-delete" value = "X">
                </div>
            </div>
            <input type = "button" id = "add-contributor" value = "+ Add Contributor">
        </form>
    </div>
    `
}


export function setup() {

    const contributor_list = document.getElementById("contributor-list")
    const add_contributor = document.getElementById("add-contributor")

    add_contributor.addEventListener("click", function () {
        const contributor = document.createElement("div")
        contributor.classList.add("contributor")

        const contributor_text = document.createElement("input")
        contributor_text.type = "text"
        contributor_text.classList.add("new-contributor")
        contributor.appendChild(contributor_text)

        const delete_contributor = document.createElement("input")
        delete_contributor.type = "button"
        delete_contributor.classList.add("new-contributor-delete")
        delete_contributor.value = "X"
        contributor.appendChild(delete_contributor)

        contributor_list.appendChild(contributor)
    })
}