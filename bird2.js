const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

// width and height of each platform
const platformWidth = 60;
const platformHeight = 60;
// array to hold platform images
const platformImages = [
  "image/brownleafnobg.png",
  // Add more image paths as needed
];

// information about each platform
let platforms = [];

// Load the image for the player
const playerImage = new Image();
playerImage.src = "image/fatbird.png"; // Replace 'image/fatbird.png' with the actual path to your player image

// Load multiple images for the platforms
const platformImagePromises = platformImages.map((path) => {
  const img = new Image();
  img.src = path;
  return new Promise((resolve) => {
    img.onload = () => resolve(img);
  });
});

// Once all platform images are loaded, start the game loop
Promise.all(platformImagePromises).then((images) => {
  startGame(images);
});

function startGame(platformImages) {
  // game loop
  function loop() {
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw platforms
    platforms.forEach((platform) => {
      context.drawImage(
        platformImages[platform.imageIndex],
        platform.x,
        platform.y,
        platformWidth,
        platformHeight
      );

      // Check if doodle is colliding with the platform from above
      if (
        doodle.dy > 0 &&
        doodle.y + doodle.height >= platform.y &&
        doodle.y < platform.y + platformHeight &&
        doodle.x + doodle.width > platform.x &&
        doodle.x < platform.x + platformWidth
      ) {
        // Reset doodle position so it's on top of the platform
        doodle.y = platform.y - doodle.height;
        // Make the doodle bounce up
        doodle.dy = -8; // Adjust the bounce velocity as needed
      }
    });

    // draw doodle
    context.drawImage(
      playerImage,
      doodle.x,
      doodle.y,
      doodle.width,
      doodle.height
    );

    // move doodle
    doodle.y += doodle.dy;

    // apply gravity to doodle
    doodle.dy += doodle.gravity;

    // Check if doodle hits the ground
    if (doodle.y + doodle.height > canvas.height) {
      doodle.y = canvas.height - doodle.height;
      doodle.dy = 0;
    }

    // other game logic...
  }

  // Generate platforms with random positions and images
  function generatePlatforms() {
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * (canvas.width - platformWidth);
      const y = Math.random() * (canvas.height - platformHeight);
      const imageIndex = Math.floor(Math.random() * platformImages.length);
      platforms.push({ x, y, imageIndex });
    }
  }

  // Call the generatePlatforms function to create initial platforms
  generatePlatforms();

  // Start the game loop
  loop();
}

// the doodle jumper
const doodle = {
  width: 50,
  height: 40,
  x: canvas.width / 2 - 20,
  y: canvas.height - 90,
  gravity: 0.5, // adjust gravity as needed
  dy: 0, // velocity in the y direction
};

// listen to keyboard events to move doodle
document.addEventListener("keydown", function (e) {
  // left arrow key
  if (e.which === 37) {
    // Move doodle left
    doodle.x -= 10;
  }
  // right arrow key
  else if (e.which === 39) {
    // Move doodle right
    doodle.x += 10;
  }
  // spacebar
  else if (e.which === 32) {
    // Jump
    doodle.dy = -10;
  }
});

// Prevent scrolling with arrow keys and spacebar
window.addEventListener(
  "keydown",
  function (e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  },
  false
);
