const bookmarkButton = document.getElementById("bookmark");
const backProjectButtons = document.querySelectorAll(".back-project-button");
const overlay = document.getElementById("overlay");
const backProjectModal = document.getElementById("overlay-content");
const closeModal = document.getElementById("close-modal");
const radioButtons = document.querySelectorAll('input[type="radio"][name="pledge-option"]');
const pledgeWrapper = document.querySelectorAll('.modal__enter-pledge-wrapper');
const pledgeInputAll = document.querySelectorAll('.pledge-input');
const continueButtons = document.querySelectorAll('.continue-button');
const thanksModal = document.getElementById('overlay-thanks');
const gotItButton = document.getElementById('got-it-button');
const hamburgerMenu = document.getElementById('hamburger');
const hamburgerIcon = document.getElementById('hamburger-icon');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const mobileMenuModal = document.getElementById('mobile-menu-modal');
const body = document.getElementById('body');

// record last input value to revert to if input is not valid
let savedInputValues = {};

function saveInputValue(inputElement) {
    savedInputValues[inputElement.id] = inputElement.value;
    console.log("print all input vales", savedInputValues);
}

// bookmark functionality
function toggleBookmark() {
    bookmarkButton.classList.toggle('bookmarked');
    const textElement = this.querySelector('.bookmark-text');
    textElement.textContent = this.classList.contains('bookmarked') ? 'Bookmarked' : 'Bookmark';
}

// toggles main modal overlay
function toggleOverlay() {
    overlay.classList.toggle('hidden');
}

// closes main modal and overlay
function closeModalAndOverlay() {
    overlay.classList.add('hidden');
    backProjectModal.classList.add('hidden');
    body.classList.remove('no-scroll');
}

// toggles mobile menu
function toggleMobileMenu() {
    mobileMenuOverlay.classList.toggle('hidden');
    mobileMenuModal.classList.toggle('hidden');
    const isExpanded = hamburgerMenu.getAttribute('aria-expanded') === 'true';
    hamburgerMenu.setAttribute('aria-expanded', !isExpanded);
    hamburgerIcon.src = !isExpanded ? 'images/icon-close-menu.svg' : 'images/icon-hamburger.svg';
    body.classList.toggle('no-scroll-mobile-menu');
}

// cache images
function preloadImage(imageURL) {
    let img = new Image();
    img.src = imageURL;
}

// animate number functionailty

function animateNumberUp(element) {
    const targetValue = parseInt(element.getAttribute("data-target"), 10);
    const duration = 1000;
    let startTime;
  
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;

        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentValue = Math.floor(progress * targetValue);
        element.textContent = currentValue;

        if (progress < 1) {
        requestAnimationFrame(animate);
        }
    }
  
    requestAnimationFrame(animate);
};

function animateNumberDown(element) {
    const startValue = parseInt(element.getAttribute("data-start"), 10);
    const targetValue = parseInt(element.getAttribute("data-target"), 10);
    const duration = 1000;
    let startTime;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
      
        const progress = Math.min((timestamp - startTime) / duration, 1);
      
        const currentValue = Math.floor(
          startValue - progress * (startValue - targetValue)
        );
      
        element.textContent = currentValue;
      
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }
      
      requestAnimationFrame(animate);
};

function animateProgressBar(element) {
    const targetValue = parseInt(element.getAttribute("data-target"), 10);
    const duration = 1000;
    let startTime;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
      
        const progress = Math.min((timestamp - startTime) / duration, 1);
      
        const currentValue = Math.floor(progress * targetValue);
      
        element.style.width = currentValue + "%";
      
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }      
      requestAnimationFrame(animate);
};

// Set up IntersectionObserver for #animated-section
const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const section = entry.target;

            // Animate numbers and progress bar within the section
            section.querySelectorAll(".animate-number-up").forEach(animateNumberUp);
            section.querySelectorAll(".animate-number-down").forEach(animateNumberDown);
            section.querySelectorAll(".animate-progress-bar").forEach(animateProgressBar);

            // Stop observing the section
            observer.unobserve(section);
        }
    });
    },
    {
        root: null,
        threshold: 0.75
    }
);

// Start observing #animated-section
const animatedSection = document.getElementById("animated-section");
sectionObserver.observe(animatedSection);

// adds functionality to radio buttons
radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
        pledgeWrapper.forEach(pledge => {
            pledge.classList.add("hidden");
            const closestCard = pledge.closest('.card');
            closestCard.classList.remove('active');
        });
        const closestPledgeWrapper = radio.closest('.card').querySelector('.modal__enter-pledge-wrapper');
        closestPledgeWrapper.classList.remove('hidden');

        const pledgeInput = closestPledgeWrapper.querySelector('.pledge-input');
        const minAmount = pledgeInput.dataset.minAmount;

        pledgeInput.value = minAmount;

        const closestCard = radio.closest('.card');
        closestCard.classList.add('active');

        saveInputValue(pledgeInput);
    });
});

// Checks pledge input is valid
pledgeInputAll.forEach(pledge => {
    pledge.addEventListener('input', () => {

        const value = pledge.value;

        const validValue = value.match(/^\d*\.?\d{0,2}$/);

        if (!validValue) {
            pledge.value = savedInputValues[pledge.id];
            console.log("in not valid method");
        } else {
            saveInputValue(pledge);
            console.log("in valid method");
        }
    });
});

// Contineu button functionality
continueButtons.forEach(button => {
    button.addEventListener('click', () => {
        backProjectModal.classList.add('hidden');
        thanksModal.classList.remove('hidden');
    });
});

// Got it button functionality
gotItButton.addEventListener('click', () => {
    overlay.classList.add('hidden');
    backProjectModal.classList.add('hidden');
    thanksModal.classList.add('hidden');
    body.classList.remove('no-scroll');
});

// Back the project button functionality
backProjectButtons.forEach(button => {
    button.addEventListener('click', () => {

        backProjectModal.classList.remove('hidden');
        overlay.classList.remove('hidden');
        body.classList.add('no-scroll');

        radioButtons.forEach(radio => {
            if(radio.id === button.dataset.radio) {
                console.log("radio button from back project activated");
                radio.checked = true;
                radio.dispatchEvent(new Event('change'));
            }
        });
    });
});

// Hamburger icon functionaity 
hamburgerMenu.addEventListener('click', toggleMobileMenu);

// Bookmark button functionality
bookmarkButton.addEventListener("click", toggleBookmark);

// Close main modal functionality 
closeModal.addEventListener("click", closeModalAndOverlay);

document.addEventListener('DOMContentLoaded', () => {
    preloadImage('images/icon-close-menu.svg');
});