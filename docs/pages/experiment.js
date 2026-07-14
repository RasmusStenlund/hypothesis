export function page() {
    return `
    <div id = "experiment-page">
         <form id = "experiment-page-form">
            <div class = "experiment-part">
                <div class = "component">
                    <h3>Title</h3>
                    <p class = "experiment-text" class = "experiment-text" id = "experiment-page-title"></p>
                </div>

                <div class = "component">
                    <h3>Date</h3>
                    <p class = "experiment-text" id = "experiment-page-date"></p>
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
                    <div id = "experiment-page-material-list">
                        <div class = "material">
                            <p class = "experiment-text" class = "experiment-material"></p>
                        </div>
                    </div>
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
    </div>
    `
}

import {call_api, show_message} from "../extra-functions.js"

export async function setup(params) {
    const response = await call_api(null, `/experiments/${params.id}`, "GET")
    const experiment = response.data

    document.getElementById("experiment-page-title").textContent = experiment.title
    document.getElementById("experiment-page-date").textContent = experiment.date

    const contributors_list = document.getElementById("experiment-page-contributor-list")
    const contributors_data = experiment.contributors
    for (const contributor of contributors_data) {
        const contributor_div = document.createElement("div")
        contributor_div.classList.add("contributor")

        const contributor_p = document.createElement("p")
        contributor_p.classList.add("experiment-text")
        contributor_p.textContent = contributor

        contributor_div.appendChild(contributor_p)
        contributors_list.appendChild(contributor_div)
    }



    document.getElementById("experiment-page-introduction").textContent = experiment.introduction
    document.getElementById("experiment-page-hypothesis").textContent = experiment.hypothesis


}