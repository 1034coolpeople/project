document.addEventListener("DOMContentLoaded", function() {
    // Section elements
    const sceneDiv = document.getElementById("scene");
    const roomSection = document.getElementById("room-section");
    const safeDiscoverySection = document.getElementById("safe-discovery-section");
    const doorSection = document.getElementById("door-section");
  
  
    // Navigation buttons (Scene)
    const btnForceKey = document.getElementById("btn-force-key");
    const btnExamineRoom = document.getElementById("btn-examine-room");
  
  
    // Navigation buttons (Room Section)
    const btnLookBehindPainting = document.getElementById("btn-look-behind-painting");
    const btnContinueExploring = document.getElementById("btn-continue-exploring");
    const exploreExtraDiv = document.getElementById("explore-extra");
    const btnForceKeyAgain = document.getElementById("btn-force-key-again");
    const btnExplorePainting = document.getElementById("btn-explore-painting");
  
  
    // Navigation buttons (Safe Discovery)
    const btnReturnDoorFromSafe = document.getElementById("btn-return-door-from-safe");
  
  
    // Navigation buttons (Door Section)
    const btnAttemptDoor = document.getElementById("btn-attempt-door");
    const btnExamineAgain = document.getElementById("btn-examine-again");
  
  
    // Door display element
    const doorDisplay = document.getElementById("door-display");
  
  
    // Sanity meter elements
    const sanityValueEl = document.getElementById("sanity-value");
    const sanityFillEl = document.getElementById("sanity-fill");
    const warningEl = document.getElementById("warning");
    const splotchesContainer = document.getElementById("splotches-container");
    const container = document.querySelector('.container');
  
  
    let sanity = 80; // starting sanity percentage
    let examinedRoom = false; // flag indicating if player has examined the room correctly
  
  
    // Array of possible warning messages
    const warningMessages = [
      "the void whispers",
      "resist the chaos",
      "echoes of despair"
    ];
  
  
    // Navigation functions
    function showScene() {
      sceneDiv.style.display = "block";
      roomSection.style.display = "none";
      safeDiscoverySection.style.display = "none";
      doorSection.style.display = "none";
    }
  
  
    function showRoomSection() {
      sceneDiv.style.display = "none";
      roomSection.style.display = "block";
      safeDiscoverySection.style.display = "none";
      doorSection.style.display = "none";
    }
  
  
    function showSafeDiscoverySection() {
      sceneDiv.style.display = "none";
      roomSection.style.display = "none";
      safeDiscoverySection.style.display = "block";
      doorSection.style.display = "none";
    }
  
  
    function showDoorSection() {
      sceneDiv.style.display = "none";
      roomSection.style.display = "none";
      safeDiscoverySection.style.display = "none";
      doorSection.style.display = "block";
    }
  
  
    // Set initial view to scene
    showScene();
  
  
    // Event listeners for Scene buttons
    btnForceKey.addEventListener("click", function() {
      // Wrong attempt from the scene when forcing the key initially.
      showDoorSection();
      wrongAttempt();
    });
  
  
    btnExamineRoom.addEventListener("click", function() {
      showRoomSection();
    });
  
  
    // Event listeners for Room Section
    btnLookBehindPainting.addEventListener("click", function() {
      // Correct choice: reveal the safe.
      examinedRoom = true;
      showSafeDiscoverySection();
    });
  
  
    btnContinueExploring.addEventListener("click", function() {
      // Wrong choice: reduce sanity and force extra options.
      updateSanity(-2);
      // Hide the initial room choices and show the extra exploration branch.
      document.getElementById("room-choices").style.display = "none";
      exploreExtraDiv.style.display = "block";
    });
  
  
    btnForceKeyAgain.addEventListener("click", function() {
      // Back to door with additional sanity loss.
      updateSanity(-5);
      showDoorSection();
      wrongAttempt();
    });
  
  
    btnExplorePainting.addEventListener("click", function() {
      // This branch leads to safe discovery.
      examinedRoom = true;
      showSafeDiscoverySection();
    });
  
  
    // Event listener for Safe Discovery Section
    btnReturnDoorFromSafe.addEventListener("click", function() {
      // Mark the room as examined and return to door.
      examinedRoom = true;
      showDoorSection();
    });
  
  
    // Event listener for Door Section
    btnAttemptDoor.addEventListener("click", function() {
      if (examinedRoom) {
        doorDisplay.textContent = "Door Opened!";
        window.location.href = "phase3.html"
      } else {
        wrongAttempt();
      }
    });
  
  
    btnExamineAgain.addEventListener("click", function() {
      showRoomSection();
      // Reset extra branch visibility
      document.getElementById("room-choices").style.display = "block";
      exploreExtraDiv.style.display = "none";
    });
  
  
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
          if (index === 0) {
            warningEl.textContent = part;
          } else {
            warningEl.textContent += " " + part;
          }
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
      if (sanity < 80) {
        let splotchCount = Math.floor((80 - sanity) / 10);
        for (let i = 0; i < splotchCount; i++) {
          addSplotch();
        }
      }
    }
  
  
    // Handle a wrong attempt: reduce sanity, add splotches, flash red,
    // and if sanity is under 20, show the death message.
    function wrongAttempt() {
      updateSanity(-5);
      addSplotches();
      doorDisplay.textContent = "The sound glitches...";
      doorDisplay.classList.add("flash");
      if (sanity < 20) {
        displayDeathMessage();
      }
      setTimeout(() => {
        doorDisplay.classList.remove("flash");
        doorDisplay.textContent = "Attempt the Door";
      }, 500);
    }
  });  