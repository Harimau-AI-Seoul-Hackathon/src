const slideIndices = {};

    function plusSlides(n) {
        const tab = document.querySelector(".tabs-content:where(:not([style*='display: none']))");
        const tabId = tab.id;
        slideIndices[tabId] = (slideIndices[tabId] || 1) + n;
        showSlides(slideIndices[tabId], tab);
    }

    function currentSlide(n) {
        const tab = document.querySelector(".tabs-content:where(:not([style*='display: none']))");
        const tabId = tab.id;
        slideIndices[tabId] = n;
        showSlides(n, tab);
    }

    function showSlides(n, tab) {
        const slides = tab.getElementsByClassName("slides");
        const dots = tab.getElementsByClassName("dot");
        let slideIndex = slideIndices[tab.id] || 1;

        if (n > slides.length) slideIndex = 1;
        if (n < 1) slideIndex = slides.length;

        slideIndices[tab.id] = slideIndex;

        // Hide all slides
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }

        // Remove active class from all dots
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        // Show current slide and activate dot
        if (slides[slideIndex - 1]) slides[slideIndex - 1].style.display = "block";
        if (dots[slideIndex - 1]) dots[slideIndex - 1].className += " active";
    }