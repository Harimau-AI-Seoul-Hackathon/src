function disaster(event, type) {
    var i, tabcontent, tablinks;

    // Hide all tab contents
    tabcontent = document.getElementsByClassName("tabs-content");
    for(i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove active class from all tab buttons
    tablinks = document.getElementsByClassName("tablinks");
    for(i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the selected tab
    document.getElementById(type).style.display = "block";
    event.currentTarget.className += " active";

    // Restart slideshow in the new tab
    showSlides(1, document.getElementById(type));  // <-- call a custom function for this tab
}
