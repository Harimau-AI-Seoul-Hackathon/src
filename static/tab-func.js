function disaster(event, type) {
    var i, tabcontent, tablinks;

    // Hide all tab contents
    tabcontent = document.getElementsByClassName("tabs-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove active class from all tab buttons
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the selected tab
    const tab = document.getElementById(type);
    tab.style.display = "block";

    // Add active class
    if (event && event.currentTarget) {
        event.currentTarget.className += " active";
    } else {
        const fallbackBtn = document.querySelector(`.tablinks[onclick*="${type}"]`);
        if (fallbackBtn) fallbackBtn.className += " active";
    }

    // Start slideshow
    showSlides(1, tab);
}
window.onload = function() {
    disaster(null, 'Emergency Preparation'); // Activate the Emergency Preparation tab
};
