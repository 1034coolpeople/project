let sanity = 100; // Initial sanity score

// Elements (Variables)
const storyText = document.getElementById("storyText");
const sanityValue = document.getElementById("sanityValue");
const choice1 = document.getElementById("choice1");
const choice2 = document.getElementById("choice2");

// Function to update game state
function updateGame(choice) {
    // Conditional logic based on the user's choice
    if (choice === 1) {
        // First choice action
        storyText.textContent = "You try to stand up but feel dizzy. Your surroundings seem to shift...";
        sanity -= 10; // Decrease sanity
    } else if (choice === 2) {
        // Second choice action
        storyText.textContent = "You look around, but everything is a blur. The walls feel alive...";
        sanity -= 5; // Slight decrease in sanity
    }

    sanityValue.textContent = sanity; // Update the sanity value in the UI

    // If sanity is zero or below, end the game
    if (sanity <= 0) {
        storyText.textContent = "Your mind unravels. You lose all sense of reality...";
        choice1.style.display = "none"; // Hide choices when sanity is 0
        choice2.style.display = "none";
    } else {
        // New set of choices after each decision
        choice1.textContent = "Try to escape";
        choice2.textContent = "Investigate surroundings";
    }
}

// Event listeners for choices (Basic function call setup)
choice1.onclick = function() {
    updateGame(1); // Choice 1
};

choice2.onclick = function() {
    updateGame(2); // Choice 2
};
