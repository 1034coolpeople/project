let sanity = 100;
let inputCode = "";
const correctCode = "317";
let currentPhase = 1;

// Phase Transition
function changePhase(phaseNumber) {
    document.querySelectorAll(".phase").forEach(phase => {
        phase.style.display = "none";
    });
    document.getElementById(`phase${phaseNumber}`).style.display = "block";
    currentPhase = phaseNumber;
}

// Update Sanity
function updateSanity(amount) {
    sanity += amount;
    sanity = Math.max(sanity, 0);
    document.getElementById('sanity').textContent = sanity;
    document.getElementById('sanity-bar-progress').style.width = `${sanity}%`;
}

// Phase 1 Choices
function makeChoice(choice) {
    switch (choice) {
        case 1:
            alert("You feel a Rusty Key.");
            changePhase(2);
            break;
        case 2:
            updateSanity(-5);
            alert("You hear eerie whispers around you...");
            break;
        case 3:
            alert("You feel something metallic. A Mysterious Coin.");
            updateSanity(-3);
            break;
        case 4:
            updateSanity(-10);
            alert("You stand still, paralyzed with fear.");
            break;
    }
}

// Phase 2 Choices
function forceKey() {
    alert("The key doesn't fit. You feel panic rising.");
    updateSanity(-10);
}

function exploreRoom() {
    alert("You find a painting with a hidden safe behind it.");
    changePhase(3);
}

// Phase 3: Safe Puzzle
function clearInput() {
    inputCode = "";
    document.getElementById("display").textContent = "Enter Code";
}

function checkCode() {
    if (inputCode === correctCode) {
        alert("Safe Opened! You found a Silver Key!");
        changePhase(4);
    } else {
        updateSanity(-5);
        alert("Wrong Code!");
        clearInput();
    }
}

document.getElementById("keypad").addEventListener("click", function (e) {
    if (e.target.classList.contains("key")) {
        const key = e.target.getAttribute("data-key");
        inputCode += key;
        document.getElementById("display").textContent = inputCode;
    }
});

document.getElementById("clear").addEventListener("click", clearInput);
document.getElementById("enter").addEventListener("click", checkCode);

// Phase 4: Open Box
function openBox() {
    alert("You open the box and find a Silver Key. You feel hope.");
    changePhase(5);
}

function hesitate() {
    updateSanity(-10);
    alert("You hesitate, feeling the darkness grow.");
}

changePhase(1);
