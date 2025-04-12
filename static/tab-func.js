function disaster(event, type) {
    const tabcontent = document.getElementsByClassName("tabs-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    document.getElementById(type).classList.add("active");
    event.currentTarget.classList.add("active");
}
