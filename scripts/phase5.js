// Game elements
const flashlightItem = document.getElementById("flashlightItem")
const lightOverlay = document.getElementById("lightOverlay")
const inventoryItems = document.getElementById("inventoryItems")
const brightnessLevel = document.getElementById("brightnessLevel")
const brightnessPercentage = document.getElementById("brightnessPercentage")
const brightnessMeterContainer = document.getElementById("brightnessMeterContainer")
const doorContainer = document.getElementById("box")


// Game state
const gameState = {
 flashlightCollected: false,
 brightness: 0,
 maxBrightness: 100,
 brightnessDecayRate: 4,
 brightnessIncreaseRate: 3,
 doorVisibilityThreshold: 20,
 isUsingFlashlight: false,
 decayInterval: null,
}


// Hide brightness meter initially
brightnessMeterContainer.style.display = "none"


// Hide door initially
doorContainer.style.opacity = "0";
doorContainer.style.transition = "opacity 0.5s ease-in-out";


// Initialize the game
function init() {
 // Add event listeners
 flashlightItem.addEventListener("click", collectFlashlight)


 // Start the game loop
 requestAnimationFrame(gameLoop)
}


// Game loop
function gameLoop() {
 updateBrightness()
 updateDoorVisibility()
 requestAnimationFrame(gameLoop)
}


// Update brightness level
function updateBrightness() {
 // Update the brightness display
 brightnessLevel.style.width = `${gameState.brightness}%`
 brightnessPercentage.textContent = `${Math.round(gameState.brightness)}%`


 // Update the light overlay
 const darkness = 0.95 - (gameState.brightness / 100) * 0.95
 lightOverlay.style.backgroundColor = `rgba(0, 0, 0, ${darkness})`
}


// Update door visibility based on brightness
function updateDoorVisibility() {
 if (gameState.brightness >= gameState.doorVisibilityThreshold) {
   // Calculate opacity based on brightness
   // Scales from 0 at threshold to 1 at threshold+50
   const visibilityRange = 50;
   const opacity = Math.min(1, (gameState.brightness - gameState.doorVisibilityThreshold) / visibilityRange);
   doorContainer.style.opacity = opacity.toString();
 } else {
   doorContainer.style.opacity = "0";
 }
}


// Collect flashlight
function collectFlashlight() {
 if (gameState.flashlightCollected) return


 gameState.flashlightCollected = true
 flashlightItem.style.display = "none"


 // Add flashlight to inventory
 const flashlightInventoryItem = document.createElement("div")
 flashlightInventoryItem.className = "inventory-item"
 flashlightInventoryItem.innerHTML = `
         <div class="inventory-item-icon flashlight-icon"/>
         </div>
         </div
         <span>Flashlight</span>
     `
    
 inventoryItems.appendChild(flashlightInventoryItem)


 // Show brightness meter
 brightnessMeterContainer.style.display = "block"


 // Add flashlight functionality
 flashlightInventoryItem.addEventListener("mousedown", startUsingFlashlight)
 flashlightInventoryItem.addEventListener("touchstart", startUsingFlashlight)


 document.addEventListener("mouseup", stopUsingFlashlight)
 document.addEventListener("touchend", stopUsingFlashlight)
}


// Start using flashlight
function startUsingFlashlight(e) {
 e.preventDefault() // Prevent default behavior for touch events


 if (!gameState.flashlightCollected) return


 gameState.isUsingFlashlight = true


 // Add active class to the flashlight item
 if (e.currentTarget.classList) {
   e.currentTarget.classList.add("active")
 }


 // Clear any existing decay interval
 if (gameState.decayInterval) {
   clearInterval(gameState.decayInterval)
 }


 // Start increasing brightness
 increaseBrightness()
}


// Stop using flashlight
function stopUsingFlashlight() {
 if (!gameState.isUsingFlashlight) return


 gameState.isUsingFlashlight = false


 // Remove active class from all inventory items
 const inventoryItemElements = document.querySelectorAll(".inventory-item")
 inventoryItemElements.forEach((item) => {
   item.classList.remove("active")
 })


 // Start decreasing brightness
 startBrightnessDecay()
}


// Increase brightness while using flashlight
function increaseBrightness() {
 if (!gameState.isUsingFlashlight) return


 gameState.brightness = Math.min(gameState.brightness + gameState.brightnessIncreaseRate, gameState.maxBrightness)


 if (gameState.brightness < gameState.maxBrightness) {
   requestAnimationFrame(increaseBrightness)
 }
}


// Start brightness decay
function startBrightnessDecay() {
 // Clear any existing decay interval
 if (gameState.decayInterval) {
   clearInterval(gameState.decayInterval)
 }


 // Set up new decay interval
 gameState.decayInterval = setInterval(() => {
   gameState.brightness = Math.max(gameState.brightness - gameState.brightnessDecayRate, 0)


   // Stop the interval when brightness reaches 0
   if (gameState.brightness <= 0) {
     clearInterval(gameState.decayInterval)
     gameState.decayInterval = null
   }
 }, 50)
}


// Unlock door
document.getElementById("unlockBtn").addEventListener("click", function() {
 let box = document.getElementById("box");
 let body = document.body;
  // Start shaking animation
 box.classList.add("shake");


 // After 1 second, start shrinking and disappearing
 setTimeout(() => {
     box.classList.add("disappear");
 }, 1000);


 // Start flashing effect after disappearing
 setTimeout(() => {
     body.classList.add("flashing");
 }, 2500);


 // Stop flashing, change background, and start text effect
 setTimeout(() => {
     body.classList.remove("flashing");
     body.style.background = "url('#') no-repeat center center";
     body.style.backgroundSize = "cover";
    
     showText();
 }, 4000);
});


// Initialize the game
init()


// Typewriter Effect
function showText() {
 let textElement = document.getElementById("text");
 textElement.style.display = "block";
 textElement.innerHTML = "";
 let text = ["Nate, Nate, NATE", "Its a miracle. Hes awake.", "You've been in a coma since your car crash."];
 let index = 0;
 let charIndex = 0;
 let currentText = "";


 function typeWriter() {
     if (index < text.length) {
         if (charIndex < text[index].length) {
             currentText += text[index].charAt(charIndex);
             textElement.innerHTML = currentText;
             charIndex++;
             setTimeout(typeWriter, 50);
         } else {
             // When line is complete, add line breaks and move to next line
             currentText += "<br><br>";
             textElement.innerHTML = currentText;
             index++;
             charIndex = 0;
             setTimeout(typeWriter, 500);
         }
     }
 }


 typeWriter();
}