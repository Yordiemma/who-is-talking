const voice = document.getElementById("voice");
const playBtn = document.getElementById("playBtn");
const animals = document.querySelectorAll(".characters img");

const turtle = document.querySelector('[data-animal="turtle"]');
const tiger = document.querySelector('[data-animal="tiger"]');

const slowSounds = ["slow1.mp3", "slow2.mp3"];
const fastSounds = ["fast1.mp3", "fast2.mp3"];

let correctAnimal = null;
let gameRunning = false;
let timer = null;

/* helpers */
function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function stopAll() {
  voice.pause();
  voice.currentTime = 0;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function resetView() {
  animals.forEach(a => {
    a.classList.remove("reveal", "fade");
    a.style.pointerEvents = "auto";
  });
}


playBtn.addEventListener("click", () => {
  if (!gameRunning) {
    // ▶️ START GAME
    gameRunning = true;
    playBtn.textContent = "⏹ Stop";
    nextRound();
  } else {
    // ⏹ STOP GAME
    gameRunning = false;
    playBtn.textContent = "▶️ Play";
    stopAll();
    resetView();
  }
});

/* --------------------------
   ROUND LOOP
-------------------------- */
function nextRound() {
  if (!gameRunning) return;

  stopAll();
  resetView();

  const isSlow = Math.random() < 0.5;
  correctAnimal = isSlow ? turtle : tiger;

  const soundFile = isSlow
    ? randomFrom(slowSounds)
    : randomFrom(fastSounds);

  // question
  voice.src = "assets/sounds/question.mp3";
  voice.play();

  // animal sound
  timer = setTimeout(() => {
    if (!gameRunning) return;
    voice.src = `assets/sounds/${soundFile}`;
    voice.play();
  }, 3000);
}

/* --------------------------
   IMAGE CLICK
-------------------------- */
animals.forEach(animal => {
  animal.addEventListener("click", () => {
    if (!gameRunning) return;

    stopAll();

    // wrong → ignore
    if (animal !== correctAnimal) return;

    animals.forEach(a => {
      if (a !== animal) a.classList.add("fade");
      a.style.pointerEvents = "none";
    });

    animal.classList.add("reveal");

    // auto next round
    timer = setTimeout(() => {
      nextRound();
    }, 2000);
  });
});
