// script.js
document.addEventListener("DOMContentLoaded", function() {
    // Section elements
    const sceneDiv = document.getElementById("scene");
    const listenSection = document.getElementById("listen-section");
    const feelSection = document.getElementById("feel-section");
    const standSection = document.getElementById("stand-section");
    const staySection = document.getElementById("stay-section");
    const pickupSection = document.getElementById("pick-up-object-section");
  
    // Navigation buttons
    const btnFeelAround = document.getElementById("btn-feel");
    const btnStand = document.getElementById("btn-stand");
    const btnStay = document.getElementById("btn-stay");
    const btnListen = document.getElementById("btn-listen");

    // Util buttons
    const btnGoBack = document.getElementById("btn-go-back");
    const btnIgnoreVoices = document.getElementById("btn-ignore-voices");
    const btnLeaveObject = document.getElementById("btn-leave-object");
    const btnListen2 = document.getElementById("btn-listen2");
    const btnFeel2 = document.getElementById("btn-feel2");
    const btnPickUpKey = document.getElementById("btn-pick-up-key");
    const btnPickUpKey2 = document.getElementById("btn-pick-up-key2")
    const btnResistKey = document.getElementById("btn-resist");
    const btnTakeKey = document.getElementById("btn-take-key");
    const btnScreamBack = document.getElementById("btn-scream-back");
  
    // Safe puzzle elements
    const display = document.getElementById("display");
    const keypad = document.getElementById("keypad");
    const clearBtn = document.getElementById("clear");
    const enterBtn = document.getElementById("enter");
    const sanityValueEl = document.getElementById("sanity-value");
    const sanityFillEl = document.getElementById("sanity-fill");
    const warningEl = document.getElementById("warning");
    const splotchesContainer = document.getElementById("splotches-container");
    const container = document.querySelector('.container');
  
    let sanity = 80; // starting sanity percentage
  
    // Navigation functions
    function hideAllScenes(){
      sceneDiv.style.display = "none";
      listenSection.style.display = "none"
      feelSection.style.display = "none";
      standSection.style.display = "none";
      staySection.style.display = "none"
      pickupSection.style.display = "none";
    }
    function showScene() {
      hideAllScenes();
      sceneDiv.style.display = "block";
    }
  
    function showListen() {
      hideAllScenes();
      listenSection.style.display = "block"
    }

    function showFeel(){
      hideAllScenes();
      feelSection.style.display = "block";
    }
  
    function showStand() {
      hideAllScenes();
      standSection.style.display = "block";
    }

    function showStay(){
      hideAllScenes();
      staySection.style.display = "block"
    }

    function showPickup(){
      hideAllScenes();
      pickupSection.style.display = "block";
    }

    function changePhase(){
      window.location.href = "phase2.html"
    }

    function resistKey(){
      updateSanity(-5);
    }

    function screamBack(){
      sanity-=5;
      window.alert("You scream, but it drowns you out.");
      window.alert("DEBUG: Current sanity = " +sanity);
    }
  
    // Set initial view to scene
    showScene();
  
    // Event listeners for navigation buttons
    btnFeelAround.addEventListener("click", showFeel);
    btnListen.addEventListener("click", showListen);
    btnStand.addEventListener("click", showStand);
    btnStay.addEventListener("click", showStay);

    // Event listeners for util buttons
    btnGoBack.addEventListener("click", showScene);
    btnIgnoreVoices.addEventListener("click", showScene);
    btnScreamBack.addEventListener("click", screamBack);
    btnLeaveObject.addEventListener("click", showScene);
    btnListen2.addEventListener("click", showListen);
    btnFeel2.addEventListener("click", showFeel);
    btnPickUpKey.addEventListener("click", showPickup);
    btnPickUpKey2.addEventListener("click", showPickup);
    btnTakeKey.addEventListener("click", changePhase);
    btnResistKey.addEventListener("click", resistKey);
  
    // Update sanity and visual feedback
    function updateSanity(amount) {
      sanity = Math.max(sanity + amount, 0);
      sanityValueEl.textContent = sanity;
      sanityFillEl.style.width = sanity + "%";
      
      // Update visual effects based on sanity thresholds
      if (sanity <= 15) {
        sanityFillEl.style.backgroundColor = "#f00";
        container.classList.add("bleeding");
      } else if (sanity <= 20) {
        container.classList.add("low-sanity");
        sanityFillEl.style.backgroundColor = "#ff9800";
      } else {
        container.classList.remove("low-sanity", "bleeding");
        sanityFillEl.style.backgroundColor = "#4caf50";
      }
    }
  
    // Get a random position for the warning message that does not overlap with the container.
    function getRandomWarningPosition() {
      const containerRect = container.getBoundingClientRect();
      const warningWidth = 200;  // approximate width
      const warningHeight = 50;  // approximate height
      let pos = { top: 0, left: 0 };
      let attempts = 0;
      do {
        pos.top = Math.random() * (window.innerHeight - warningHeight);
        pos.left = Math.random() * (window.innerWidth - warningWidth);
        attempts++;
      } while (overlaps(pos, containerRect, warningWidth, warningHeight) && attempts < 10);
      return pos;
    }
  
    // Check if the warning (at pos with given dimensions) overlaps the container.
    function overlaps(pos, rect, width, height) {
      const warningRect = {
        left: pos.left,
        top: pos.top,
        right: pos.left + width,
        bottom: pos.top + height
      };
      if (warningRect.right < rect.left || warningRect.left > rect.right ||
          warningRect.bottom < rect.top || warningRect.top > rect.bottom) {
        return false;
      }
      return true;
    }
  
    // Display a random warning message word-by-word with a 1-second delay between words,
    // then fade it out slowly.
    function displayDeathMessage() {
      // Choose a random message from the array.
      const message = warningMessages[Math.floor(Math.random() * warningMessages.length)];
      const messageParts = message.split(" ");
      // Set a random position for the warning element.
      const pos = getRandomWarningPosition();
      warningEl.style.position = "absolute";
      warningEl.style.top = pos.top + "px";
      warningEl.style.left = pos.left + "px";
      warningEl.textContent = "";
      warningEl.style.display = "block";
      warningEl.classList.remove("fade-out");
      let delay = 0;
      messageParts.forEach((part, index) => {
        setTimeout(() => {
          if (index === 0) {
            warningEl.textContent = part;
          } else {
            warningEl.textContent += " " + part;
          }
        }, delay);
        delay += 1000;
      });
      // After full message is displayed, start fade out.
      setTimeout(() => {
        warningEl.classList.add("fade-out");
        setTimeout(() => {
          warningEl.style.display = "none";
          warningEl.classList.remove("fade-out");
          warningEl.textContent = "";
        }, 3000);
      }, delay);
    }
  
    // Add a blood splotch at a random position anywhere on the screen.
    function addSplotch() {
      const splotch = document.createElement("div");
      splotch.classList.add("splotch");
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      splotch.style.left = x + "px";
      splotch.style.top = y + "px";
      splotchesContainer.appendChild(splotch);
      setTimeout(() => {
        splotch.remove();
      }, 2000);
    }
  
    // Add multiple splotches based on current sanity (for each 10% drop below 80)
    function addSplotches() {
      if (sanity < 70) {
        let splotchCount = Math.floor((80 - sanity) / 10);
        for (let i = 0; i < splotchCount; i++) {
           addSplotch();
        }
      }
    }
  
    // Clear keypad input
    function clearInput() {
      inputCode = "";
      display.textContent = "Enter Code";
    }
  
    // Handle a wrong attempt: reduce sanity, add splotches, flash red,
    // and if sanity is under 20, show the death message.
    function wrongAttempt() {
      updateSanity(-3);
      addSplotches();
      display.textContent = "Wrong!";
      display.classList.add("flash");
      if (sanity < 20) {
        displayDeathMessage();
      }
      setTimeout(() => {
        display.classList.remove("flash");
        clearInput();
      }, 500);
    }
  
    // Check if the entered code is correct
    function checkCode() {
      if (inputCode === correctCode) {
        display.textContent = "Safe Opened!";
        keypad.querySelectorAll("button").forEach(btn => btn.disabled = true);
      } else {
        wrongAttempt();
      }
    }
  
    // Keypad input handler
    keypad.addEventListener("click", function(e) {
      if (e.target.classList.contains("key") && !e.target.disabled) {
        const key = e.target.getAttribute("data-key");
        if (key !== null) {
          if (inputCode.length < 3) {
            inputCode += key;
            display.textContent = inputCode;
          }
        }
      }
    });
  
    clearBtn.addEventListener("click", clearInput);
  
    enterBtn.addEventListener("click", function() {
      if (inputCode.length === 3) {
        checkCode();
      } else {
        display.textContent = "Incomplete";
        setTimeout(() => {
          display.textContent = inputCode || "Enter Code";
        }, 500);
      }
    });
  });
  