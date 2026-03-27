const currentYear = new Date().getFullYear();

const answers = {
  1: ["3"],
  2: ["1"],
  3: ["3"],
  4: ["2"],
  5: ["2"],
  6: ["1"],
  7: ["1"],
};

// // Show first note after intro animation
// window.addEventListener("load", () => {
//   setTimeout(() => {
//     const intro = document.getElementById("intro");
//     intro.style.transition = "opacity 1s";
//     intro.style.opacity = "0";
//     setTimeout(() => {
//       intro.style.display = "none";

//       // If URL has hash, go there
//       const hash = window.location.hash.substring(1);
//       if (hash && document.getElementById(hash)) {
//         showSlide(hash, true);
//       } else {
//         showSlide("note1", true);
//       }
//     }, 1000);
//   }, 3000);
// });

// Countdown unlock system
const unlockTime = new Date("2025-10-22T16:42:00").getTime();
const countdownScreen = document.getElementById("countdown-screen");
const timerDisplay = document.getElementById("countdown-timer");

const countdownInterval = setInterval(() => {
  const now = new Date().getTime();
  const distance = unlockTime - now;

  if (distance <= 0) {
    clearInterval(countdownInterval);
    countdownScreen.style.opacity = "0";
    countdownScreen.style.transition = "opacity 1s";
    setTimeout(() => {
      countdownScreen.style.display = "none";
      startJourney(); // reveal everything
    }, 1000);
  } else {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    timerDisplay.textContent =
      `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
}, 1000);

// Function to reveal the actual content once time is up
function startJourney() {
  // hide everything first
  document.querySelectorAll(".walk-scene, .note, .quest").forEach(el => el.style.display = "none");
  
  // Show first slide
  const hash = window.location.hash.substring(1);
  const firstSlide = hash && document.getElementById(hash) ? hash : 'scene1';
  const firstEl = document.getElementById(firstSlide);
  if (firstEl) {
    firstEl.style.display = firstEl.classList.contains("note") ? "flex" : "block";
    history.replaceState({ slide: firstSlide }, "", "#" + firstSlide);
  }
}


window.addEventListener("popstate", (event) => {
  if (event.state && event.state.slide) {
    const slideId = event.state.slide;
    
    // Hide all intro scenes, notes, and quests
    document.querySelectorAll(".walk-scene, .note, .quest").forEach(el => el.style.display = "none");

    // Show the requested slide
    const el = document.getElementById(slideId);
    if (el) {
      el.style.display = el.classList.contains("note") ? "flex" : "block";
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
});



window.addEventListener("load", () => {
  const hash = window.location.hash.substring(1);
  const firstSlide = hash && document.getElementById(hash) ? hash : 'scene1';

  // Hide everything initially
  document.querySelectorAll(".walk-scene, .note, .quest").forEach(el => el.style.display = "none");

  // Show first slide
  document.getElementById(firstSlide).style.display = 
      document.getElementById(firstSlide).classList.contains("note") ? "flex" : "block";

  // Push initial state
  history.replaceState({ slide: firstSlide }, "", "#" + firstSlide);
});




// Show a slide and update history if needed
function showSlide(slideId, replace = false) {
  // Hide all slides
  document.querySelectorAll(".note, .quest").forEach(el => el.style.display = "none");

  const slideEl = document.getElementById(slideId);
  if (!slideEl) return;

  // Display the slide
  slideEl.style.display = slideEl.classList.contains("note") ? "flex" : "block";
  slideEl.scrollIntoView({ behavior: "smooth", block: "start" });

  // Update history
  if (replace) {
    history.replaceState({ slide: slideId }, "", "#" + slideId);
  } else {
    history.pushState({ slide: slideId }, "", "#" + slideId);
  }
}

// Navigate from current to next slide
function nextSlide(currentId, nextId) {
  showSlide(nextId);
}

// Handle back/forward navigation
window.addEventListener("popstate", (event) => {
  if (event.state && event.state.slide) {
    showSlide(event.state.slide, true);
  }
});

// Check answer for questions
function checkAnswer(qNum) {
  let userAnswer = "";

  // Multiple-choice (radio buttons)
  const radios = document.getElementsByName(`answer${qNum}`);
  if (radios.length > 0) {
    for (let r of radios) {
      if (r.checked) {
        userAnswer = r.value.trim().toLowerCase();
        break;
      }
    }
  } else {
    // Text input
    const input = document.getElementById(`answer${qNum}`);
    if (input) {
      userAnswer = input.value.trim().toLowerCase();
    }
  }

  // Check correctness
  if (answers[qNum].includes(userAnswer)) {
    // Hide current
    const questEl = document.getElementById(`quest${qNum}`);
    const noteEl = document.getElementById(`note${qNum}`);

    if (questEl) questEl.style.display = "none";
    if (!questEl && noteEl) noteEl.style.display = "none"; // for question 9

    // Show extra note if exists
    if (qNum < 9) {
      const extraNote = document.getElementById(`note${qNum}b`);
      if (extraNote) {
        showSlide(extraNote.id);
      } else {
        const nextNote = document.getElementById(`note${qNum + 1}`);
        if (nextNote) showSlide(nextNote.id);
      }
    } else {
      // Final love note
      const finalNote = document.getElementById("note9b");
      if (finalNote) showSlide(finalNote.id);
    }
  } else {
    document.getElementById(`feedback${qNum}`).textContent = "Try again!";
  }
}

// Enable Enter key submission for text inputs
for (let i = 1; i <= 9; i++) {
  const input = document.getElementById(`answer${i}`);
  if (input) {
    input.addEventListener("keydown", function(event) {
      if (event.key === "Enter") checkAnswer(i);
    });
  }
}

// Hotspots for Q5
const hotspots = document.querySelectorAll("#quest5 .hotspot");
hotspots.forEach(hs => {
  hs.addEventListener("click", function() {
    const answer = hs.dataset.answer;
    if (answer === "correct") {
      // Correct
      document.getElementById("quest5").style.display = "none";
      const extraNote = document.getElementById("note5b");
      if (extraNote) showSlide(extraNote.id);
      else showSlide("note6");
    } else {
      document.getElementById("feedback5").textContent = "Try again!";
    }
  });
});

function nextScene(current, next) {
  document.getElementById(current).style.display = 'none';
  document.getElementById(next).style.display = 'block';
  
  // Update history
  history.pushState({ slide: next }, "", "#" + next);
}



function pickNote() {
  // Hide current animation scene
  document.querySelectorAll('#intro .walk-scene').forEach(el => el.style.display = 'none');
  
  // Show the note
  document.getElementById('note1').style.display = 'block';
  
  // Push history state
  history.pushState({ slide: 'note1' }, "", "#note1");
}


