let sanity = 100;

function updateSanity(amount) {
    sanity += amount;
    if (sanity < 0) sanity = 0;
    document.getElementById("sanity").textContent = sanity;


    // If sanity is below 15, trigger eerie effects
    if (sanity <= 15) {
        document.getElementById("box").classList.add("pulsate");
        document.getElementById("box-content").innerHTML = "<span class='key'>Time is slipping away...</span>";
    }
}

function openBox() {
    document.getElementById("box-content").innerHTML = "<span class='key'>🗝️</span>";
    document.getElementById("message").textContent = "You open the box and find a small silver key...";
    
    window.location.href = "phase5.html"
    // Stop the pulsating effect if sanity is restored
    document.getElementById("box").classList.remove("pulsate");
}

function hesitate() {
    updateSanity(-5);
    document.getElementById("message").textContent = "A whisper in the darkness says: 'You shouldn’t have done that...'";


    if (sanity <= 15) {
        document.getElementById("message").textContent = "You're slipping into the abyss... This is the end...";
    }
}