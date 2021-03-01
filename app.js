//--------------------------------------------------------------------------------------------------------
//      for dynamically generating project components

function Div(classes, options) {
    let div = document.createElement("div")
    if (typeof classes == "object") {
        for (let css_class of classes)
            div.classList.add(css_class)
    } else {
        div.classList.add(classes)
    }
    for (let prop in options)
        div[prop] = options[prop]
    return div
}

function Project(api_item) {
    let url = api_item.has_pages ?
        "https://mbartoldus.github.io/" + api_item.name :
        api_item.svn_url
    let lang = api_item.language
    lang = lang == "JavaScript" || !lang ? "js" : lang // assume javascript if no language is given
    let theme_color
    switch (lang) {
        case "js": theme_color = "mint"
            break
        case "C++": theme_color = "orange"
            break
        case "HTML":
        case "CSS": theme_color = "cyan"
            break
        default: theme_color = "grey"
    }
    let img_style = "background-image: url('https://raw.githubusercontent.com/mBartoldus/" +
        api_item.name +
        "/main/preview.gif')"
    let project = Div("card-container", { style: "--index: 0; --theme-color: var(--" + theme_color + ")" })
    project.setAttribute("data-href", url)
    let card = Div("card")
    let project_img = Div("project-img", { style: img_style })
    let title = Div("title", { innerText: api_item.name })
    let description = Div("description", { innerText: api_item.description })
    let language = Div("project-language", { innerText: lang })
    project.appendChild(card)
    project.appendChild(language)
    card.appendChild(project_img)
    card.appendChild(title)
    card.appendChild(description)
    document.getElementById("projects").appendChild(project)

    project.addEventListener("click", open_href)
}

//--------------------------------------------------------------------------------------------------------
//      basic modal window behavior

function open_modal(modal_id) {
    close_modal()
    document.getElementById(modal_id).classList.add("current")
    document.body.style.overflow = "hidden"
}

function close_modal() {
    for (let modal of document.getElementsByClassName("current")) modal.classList.remove("current")
    document.body.style.overflow = "visible"
}


for (let modal of document.getElementsByClassName("modal")) {
    modal.addEventListener("click", function (e) { if (e.target == this) close_modal() })
}

document.addEventListener("keydown", e => {
    if (e.key == "Escape") close_modal()
})

document.querySelector(".navbar").addEventListener("click", function (e) {
    if (e.target.tagName != "A") close_modal()
})

//--------------------------------------------------------------------------------------------------------
//      get data from github api

const git = (async () => {
    let url = "https://api.github.com/search/repositories?q=user:mBartoldus"
    let api_items = (await (await fetch(url, {
        "method": "GET",
        "headers": {
            "Accept": "application/vnd.github.cloak-preview",
        },
    })).json()).items

    for (let api_item of api_items) {
        console.log(api_item)
        Project(api_item)
    }
})()

//--------------------------------------------------------------------------------------------------------
//      initialize clickables

function open_href() {
    document.location.href = this.getAttribute("data-href")
}

for (let card_container of document.getElementsByClassName("card-container")) {
    if (card_container.getAttribute("data-href")) {
        card_container.addEventListener("click", open_href)
    }
}

function toggle_modal(modal_id) {
    return function () {
        let modal = document.getElementById(modal_id)
        let is_open = modal.classList.contains("current")
        if (is_open) close_modal()
        else open_modal(modal_id)
    }
}

document.getElementById("contact-button").addEventListener("click", toggle_modal("contact"))
document.getElementById("about-button").addEventListener("click", toggle_modal("about"))
