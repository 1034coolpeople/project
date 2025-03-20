document.addEventListener("DOMContentLoaded", function() {
    // Section elements
    const sceneDiv = document.getElementById("scene");
    const safeSection = document.getElementById("safe-section");
    const paintingSection = document.getElementById("painting-section");
  
    // Navigation buttons
    const btnStartGuessing = document.getElementById("btn-start-guessing");
    const btnExaminePainting = document.getElementById("btn-examine-painting");
    const btnViewPainting = document.getElementById("btn-view-painting");
    const btnReturnSafe = document.getElementById("btn-return-safe");
  
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
  
    let inputCode = "";
    const correctCode = "317"; // Derived from hints: 9/3=3, 1/1=1, 10-3=7
    let sanity = 80; // Starting sanity percentage
  
    // Array of possible warning messages
    const warningMessages = [
      "death is close",
      "stop",
      "think"
    ];
  
    // Navigation functions
    function showScene() {
      sceneDiv.style.display = "block";
      safeSection.style.display = "none";
      paintingSection.style.display = "none";
    }
  
    function showSafeSection() {
      sceneDiv.style.display = "none";
      safeSection.style.display = "block";
      paintingSection.style.display = "none";
    }
  
    function showPaintingSection() {
      sceneDiv.style.display = "none";
      safeSection.style.display = "none";
      paintingSection.style.display = "block";
    }
  
    // Set initial view to scene
    showScene();
  
    // Event listeners for navigation buttons
    btnStartGuessing.addEventListener("click", showSafeSection);
    btnExaminePainting.addEventListener("click", showPaintingSection);
    btnViewPainting.addEventListener("click", showPaintingSection);
    btnReturnSafe.addEventListener("click", showSafeSection);
  
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
  
    // Get random position for warning message with safe zone
    function getRandomWarningPosition() {
      const containerRect = container.getBoundingClientRect();
      const warningWidth = 200;
      const warningHeight = 50;
      const safeZonePadding = 100;
      
      const safeZone = {
        left: containerRect.left - safeZonePadding,
        right: containerRect.right + safeZonePadding,
        top: containerRect.top - safeZonePadding,
        bottom: containerRect.bottom + safeZonePadding
      };
  
      let pos, isValidPosition;
      let attempts = 0;
      
      do {
        pos = {
          top: Math.random() * (window.innerHeight - warningHeight),
          left: Math.random() * (window.innerWidth - warningWidth)
        };
        
        isValidPosition = 
          pos.left + warningWidth < safeZone.left ||
          pos.left > safeZone.right ||
          pos.top + warningHeight < safeZone.top ||
          pos.top > safeZone.bottom;
        
        attempts++;
      } while (!isValidPosition && attempts < 100);
  
      return pos;
    }
  
    // Check if position overlaps with safe zone
    function overlaps(pos, safeZone, width, height) {
      return (
        pos.left < safeZone.right &&
        pos.left + width > safeZone.left &&
        pos.top < safeZone.bottom &&
        pos.top + height > safeZone.top
      );
    }
  
    // Display random warning message
    function displayDeathMessage() {
      const message = warningMessages[Math.floor(Math.random() * warningMessages.length)];
      const messageParts = message.split(" ");
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
          warningEl.textContent = index === 0 ? part : `${warningEl.textContent} ${part}`;
        }, delay);
        delay += 1000;
      });
  
      setTimeout(() => {
        warningEl.classList.add("fade-out");
        setTimeout(() => {
          warningEl.style.display = "none";
          warningEl.classList.remove("fade-out");
          warningEl.textContent = "";
        }, 3000);
      }, delay);
    }
  
    // Add blood splotch
    function addSplotch() {
      const splotch = document.createElement("div");
      splotch.classList.add("splotch");
      splotch.style.left = Math.random() * window.innerWidth + "px";
      splotch.style.top = Math.random() * window.innerHeight + "px";
      splotchesContainer.appendChild(splotch);
      setTimeout(() => splotch.remove(), 2000);
    }
  
    // Add multiple splotches
    function addSplotches() {
      if (sanity < 70) {
        const splotchCount = Math.floor((80 - sanity) / 10);
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
  
    // Handle wrong attempts
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
  
    // Check code validity
    function checkCode() {
      if (inputCode === correctCode) {
        display.textContent = "Safe Opened!";
        keypad.querySelectorAll("button").forEach(btn => btn.disabled = true);
        window.location.href = "phase4.html"
      } else {
        wrongAttempt();
      }
    }
  
    // Keypad event listeners
    keypad.addEventListener("click", function(e) {
      if (e.target.classList.contains("key") && !e.target.disabled) {
        const key = e.target.getAttribute("data-key");
        if (key && inputCode.length < 3) {
          inputCode += key;
          display.textContent = inputCode;
        }
      }
    });
  
    clearBtn.addEventListener("click", clearInput);
  
    enterBtn.addEventListener("click", function() {
      inputCode.length === 3 ? checkCode() : display.textContent = "Incomplete";
      if (inputCode.length !== 3) {
        setTimeout(() => {
          display.textContent = inputCode || "Enter Code";
        }, 500);
      }
    });
  });
  