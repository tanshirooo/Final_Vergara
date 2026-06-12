let currentActiveIndex = 1;

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Structural Accordion Logic Engine
    const accordions = document.querySelectorAll(".modern-accordion");
    accordions.forEach(acc => {
        acc.addEventListener("click", function() {
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });

    // 2. Initialize Slide Navigation Array Nodes & Pagination Layout
    initializeDots();
    renderSlides(currentActiveIndex);

    // 3. Document Navigation Scroll Tracking Matrix
    window.addEventListener('scroll', executeScrollMetrics);
});

// Build Slide Indicators Dynamically
function initializeDots() {
    const slides = document.getElementsByClassName("slide");
    const container = document.getElementById("dotContainer");
    if(!container) return;
    
    container.innerHTML = ""; // Clear existing contents safely
    for(let idx = 0; idx < slides.length; idx++) {
        let dotElement = document.createElement("span");
        dotElement.className = "dot";
        dotElement.setAttribute("onclick", `jumpToSlide(${idx + 1})`);
        container.appendChild(dotElement);
    }
}

// Controller Logic for Next/Prev Actions
function changeSlide(step) {
    renderSlides(currentActiveIndex += step);
}

// Direct Navigation Index Selection
function jumpToSlide(targetIndex) {
    renderSlides(currentActiveIndex = targetIndex);
}

function renderSlides(indexPosition) {
    let slides = document.getElementsByClassName("slide");
    let indicators = document.getElementsByClassName("dot");
    
    if (slides.length === 0) return;
    
    if (indexPosition > slides.length) { currentActiveIndex = 1; }
    if (indexPosition < 1) { currentActiveIndex = slides.length; }
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        
        // Context Preservation: Safely pause running media segments when moving away
        let embeddedVideo = slides[i].querySelector("video");
        if(embeddedVideo) {
            embeddedVideo.pause();
        }
    }
    
    for (let d = 0; d < indicators.length; d++) {
        indicators[d].classList.remove("active-dot");
    }
    
    slides[currentActiveIndex - 1].style.display = "block";
    if(indicators[currentActiveIndex - 1]) {
        indicators[currentActiveIndex - 1].classList.add("active-dot");
    }
}

// Window Navigation Progress Calculations
function executeScrollMetrics() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const bar = document.getElementById("progressBar");
    if(bar) {
        bar.style.width = scrolled + "%";
    }

    // Dynamic Navigation Highlighting
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-dock a");
    
    let currentSectionId = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.pageYOffset >= sectionTop) {
            currentSectionId = section.getAttribute("id");
        }
    });

    if (currentSectionId) {
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    }
}