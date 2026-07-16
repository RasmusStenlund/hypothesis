    export function page() {
        return `
        <div class = "experiments">
            <div id = "filter-experiments">
                <input type = "text" id = "search-experiments" placeholder = "Search experiment by title...">
                <div id = "sort-div">
                    <p>Sort by:</p>
                    <select id = "sort-experiments">
                        <option value = "Newest">Newest</option>
                        <option value = "Oldest">Oldest</option>
                        <option value = "A-Z">Title A-Z</option>
                        <option value = "Z-A">Title Z-A</option>
                    </select>
                </div>
            </div>

            <div id = "experiments-list"></div>
            <div id = "no-experiments">
                <p>No experiments yet</p>
                <p>Create your first experiment to get started</p>
                <button type = "button" id = "none-button">+ New Experiment</button>
            </div>
        </div>
        `
    }

    import {call_api, show_message} from "../extra-functions.js"

    function make_experiment_card(title, date, contributors, hypothesis, id, parent) {
        const card = document.createElement("a")
        card.href = `#/experiments/${id}`
        card.classList.add("experiment-card")

        const card_title = document.createElement("h3")
        card_title.classList.add("title")
        card_title.textContent = title
        card.appendChild(card_title)
        
        const info = document.createElement("div")
        info.classList.add("info")

        const card_date = document.createElement("p")
        card_date.classList.add("date")
        card_date.textContent = date
        info.appendChild(card_date)

        const card_contributors = document.createElement("p")
        card_contributors.classList.add("contributors")
        card_contributors.textContent = contributors.join(", ")
        info.appendChild(card_contributors)
        card.appendChild(info)

        const short_hypothesis = document.createElement("p")
        short_hypothesis.classList.add("hypothesis-preview")
        short_hypothesis.textContent = hypothesis
        card.appendChild(short_hypothesis)

        parent.appendChild(card)
    }

    function show_experiments(experiments) {
        const experiments_list = document.getElementById("experiments-list") 

        experiments_list.innerHTML = ""

        for (const experiment of experiments) {
            make_experiment_card(experiment.title, experiment.date, experiment.contributors, experiment.hypothesis, experiment.id, experiments_list)
        }
    }

    export async function setup() {
        const response = await call_api(null, "/experiments", "GET")
        if (response.code === 200) {
            let experiments = response.data
            const experiments_list = document.getElementById("experiments-list")

            experiments.sort(function(a, b) {
                return new Date(b.date) - new Date(a.date)
            })
            show_experiments(experiments)

            const no_experiments = document.getElementById("no-experiments")
            if (experiments_list.innerHTML.trim() === "") {
                no_experiments.classList.add("show")
            } else {
                no_experiments.classList.remove("show")
            }

            const none_button = document.getElementById("none-button")
            none_button.addEventListener("click", function () {
                window.location.hash = '#/experiments/new'
            })

            const search_input = document.getElementById("search-experiments")

            search_input.addEventListener("input", function () {
                const search = search_input.value.toLowerCase()

                const filtered_experiments = experiments.filter(function(experiment) {
                    if (experiment.title.toLowerCase().includes(search)) {
                        return experiment
                    }
                })

                show_experiments(filtered_experiments)
            })

            const sort_input = document.getElementById("sort-experiments")

            sort_input.addEventListener("change", function () {
                const sorted = experiments.slice()

                if (sort_input.value === "Newest") {
                    sorted.sort(function(a, b) {
                        return new Date(b.date) - new Date(a.date)
                    })
                } 
                else if (sort_input.value === "Oldest") {
                    sorted.sort(function(a, b) {
                        return new Date(a.date) - new Date(b.date)
                    })
                }
                else if (sort_input.value === "A-Z") {
                    sorted.sort(function(a, b) {
                        let title_a = a.title.toLowerCase();
                        let title_b = b.title.toLowerCase();

                        if (title_a < title_b) return -1;
                        if (title_a > title_b) return 1;
                        return 0;
                    })
                }
                else if (sort_input.value === "Z-A") {
                    sorted.sort(function(a, b) {
                        let title_a = a.title.toLowerCase();
                        let title_b = b.title.toLowerCase();

                        if (title_a > title_b) return -1;
                        if (title_a < title_b) return 1;
                        return 0;
                    })
                }

                show_experiments(sorted)
            })

        } else {
            show_message("Failed to load experiments.", false)
            window.location.hash = "#/"
        }
    }