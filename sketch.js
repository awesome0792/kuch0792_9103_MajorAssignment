// Define color palette as an array of RGB arrays
const colourPalette = [
  [229, 67, 121],  // RGB for one color
  [203, 1, 11],    // RGB for another color
  [120, 34, 33],   // RGB for another color
  [128, 0, 128]    // RGB for another color
];

// Define keys for flower color components
const colorKeys = ["flower", "leaves", "endLeaves", "endLeavesStroke"];

// Define initial variables
let backgroundColor = (20, 24, 82); // Background color (RGB)
let circleRadius, centerSphereSize, endSphereSize, endSphereStroke; // Flower and dot sizes
let song, fft; // Sound and FFT (frequency analysis)
let numBins = 64; // Number of bins in FFT analysis
let smoothing = 0.9; // FFT smoothing level
let button; // Button for play/pause control
let colorVal; // Color hue based on sound frequency
let fireworks = []; // Array to hold firework objects
let flowers = []; // Array to hold flower objects
let shapes = []; // Array for background shapes
let gravity; // Gravity vector for fireworks
let playing = false; // State of song (playing or paused)

function preload() {
  // Load sound file for playback and FFT analysis
  song = loadSound('/assets/Minimal_Loop_by_GIS_Sweden.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(backgroundColor);

  // Set initial circle radius based on smallest canvas dimension
  let minDimension = min(width, height); 
  circleRadius = minDimension / 5;

  // Initialize flowers and dots
  initializeFlowers();
  initializeShapes();

  // Set up FFT (frequency analysis) and connect to song
  fft = new p5.FFT(smoothing, numBins);
  song.connect(fft);
  
  // Create play/pause button and set its position
  button = createButton("Play/Pause");
  button.position((width - button.width) / 2, height - button.height - 2);
  button.mousePressed(play_pause);

  // Define gravity for firework effect
  gravity = createVector(0, 0.2);
}

// Main drawing function, updates every frame
function draw() {
  noStroke(); // Remove outline for shapes

  // Exit early if FFT is undefined (e.g., before song loads)
  if (fft === undefined) return;

  // Get amplitude and frequency data from FFT
  let amplitude = fft.getEnergy(20, 20000);
  let centroidFreq = fft.getCentroid();
  let spectrum = fft.analyze();

  // Map frequency and amplitude data to visual properties
  colorVal = map(centroidFreq, 0, 22050, 0, 360);
  centerSphereSize = map(amplitude, 0, 255, 0, circleRadius);
  endSphereSize = centerSphereSize / 5; // Size for end of leaf
  endSphereStroke = endSphereSize / 2; // Stroke size for end of leaf

  // Set a fading background effect
  background(0, 40);

  // Draw each flower in the flowers array
  for (let flower of flowers) {
    flower.draw();
  }

  noStroke(); // Remove outline again for following elements

  // Determine if fireworks should be triggered based on spectrum data
  let flag = true;
  for (let i = 20; i < 30; i++) {
    if (spectrum[i] < 170) {
      flag = false;
    }
  }
  
  // Randomly add fireworks if the flag is true
  if (flag && random() < 0.5) {
    fireworks.push(new Firework(random(-5, map(spectrum[25], 0, 255, -5, -40))));
  }

  // Update and display each firework, remove finished ones
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }

  // Display each background shape based on spectrum data
  for (let i = 0; i < spectrum.length; i++) {
    shapes[i].display(spectrum[i] / 255, spectrum[i]);
  }
}

// Initializes flower objects in a grid pattern with random attributes
function initializeFlowers() {
  flowers = []; // Clear existing flower data
  const gridSize = width / 5; // Set grid size
  let rows = ceil(height / gridSize);
  let cols = ceil(width / gridSize);
  
  // Loop through each cell in the grid
  for (let row = 0; row < 1; row++) {
    for (let col = 0; col < cols; col++) {
      // Randomize position within the grid cell
      let x = col * gridSize + gridSize / 2 + random(-gridSize * 0.2, gridSize * 0.2);
      let y = row * gridSize + gridSize / 2 + random(-gridSize * 0.2, gridSize * 0.2);
      let leafLength = random(50, 200);
      let leafCount = random(8, 15);
      let scale = random(0.4, 1.1);

      // Assign random colors to each flower part
      let colors = Object.fromEntries(
        colorKeys.map(key => [key, colourPalette[floor(random(colourPalette.length))]])
      );

      // Create and add new flower to the flowers array
      flowers.push(new Flower(x, y, leafLength, leafCount, colors, scale));
    }
  }
  angleMode(DEGREES); // Set angle mode for flower rotation
}

// Initialize background shapes with random types
function initializeShapes() {
  shapes = [];
  for (let i = 0; i < numBins; i++) {
    let shapeType = random() > 0.5 ? "circle" : "square"; // Randomly assign shape type
    shapes.push(new RandomShapes(shapeType));
  }
}

// Toggles play/pause state for the song
function play_pause() {
  if (song.isPlaying()) {
    song.stop(); // Stop song if playing
    playing = false;
  } else {
    song.loop(); // Start song in loop mode if paused
    playing = true;
  }
}

// Adjust canvas size and reinitialize elements on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(backgroundColor);

  // Reinitialize elements for new window size
  initializeFlowers();
  initializeShapes();

  // Recalculate circle radius based on new dimensions
  let minDimension = min(width, height); 
  circleRadius = minDimension / 200;

  // Reposition play/pause button
  button.position((width - button.width) / 2, height - button.height - 2);
}