const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.8; // Set to 80% of the window width
canvas.height = window.innerHeight * 0.6; // Set to 60% of the window height

const polarBearImage = new Image();
polarBearImage.src = 'polar_bear.png';

const fishImage = new Image();
fishImage.src = 'fish.png';

let polarBear = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 150,
  width: 100,
  height: 100,
  speed: 10
};

let fish = {
  x: Math.random() * (canvas.width - 50),
  y: 0,
  width: 50,
  height: 50,
  speed: 3
};

let score = 0;
let gameDuration = 120; // Game lasts for 2 minutes (120 seconds)
let gameTimer;

// Move bear left or right with touch controls for mobile
document.getElementById('leftBtn').addEventListener('click', () => {
  polarBear.x -= polarBear.speed * 10; // Move faster with touch
});

document.getElementById('rightBtn').addEventListener('click', () => {
  polarBear.x += polarBear.speed * 10; // Move faster with touch
});

// Move polar bear with keyboard (for desktop)
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    polarBear.x -= polarBear.speed;
  } else if (e.key === 'ArrowRight' || e.key === 'd') {
    polarBear.x += polarBear.speed;
  }
});

// Handle game timing and ending
function startTimer() {
  let timeLeft = gameDuration;
  gameTimer = setInterval(() => {
    timeLeft--;
    document.getElementById('time').textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(gameTimer);
      endGame();
    }
  }, 1000);
}

function endGame() {
  alert('Time’s up! Your final score is: ' + score);
  resetGame();
}

function resetGame() {
  score = 0;
  document.getElementById('score').textContent = score;
  fish.y = 0;
  fish.x = Math.random() * (canvas.width - fish.width);
  startTimer();
}

// Game loop
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw polar bear
  ctx.drawImage(polarBearImage, polarBear.x, polarBear.y, polarBear.width, polarBear.height);

  // Draw fish
  ctx.drawImage(fishImage, fish.x, fish.y, fish.width, fish.height);

  // Move fish down
  fish.y += fish.speed;

  // Check if the fish is caught
  if (fish.y + fish.height >= polarBear.y &&
    fish.x + fish.width >= polarBear.x &&
    fish.x <= polarBear.x + polarBear.width) {
    score++;
    document.getElementById('score').textContent = score;
    fish.y = 0; // Reset fish position
    fish.x = Math.random() * (canvas.width - fish.width); // Randomize fish x-position
  }

  // If the fish reaches the bottom of the canvas, reset its position
  if (fish.y > canvas.height) {
    fish.y = 0;
    fish.x = Math.random() * (canvas.width - fish.width);
  }

  // Ensure polar bear stays within canvas bounds
  if (polarBear.x < 0) {
    polarBear.x = 0;
  }
  if (polarBear.x + polarBear.width > canvas.width) {
    polarBear.x = canvas.width - polarBear.width;
  }

  requestAnimationFrame(updateGame);
}

// Start the game
function startGame() {
  startTimer();
  updateGame();
}

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth * 0.8;
  canvas.height = window.innerHeight * 0.6;
  polarBear.x = canvas.width / 2 - 50; // Recenter bear on resize
});

// Start the game when the window loads
window.onload = startGame;
