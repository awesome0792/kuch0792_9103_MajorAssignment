// const colourPalette = [(229,67,121), (203,1,11), (120,34,33), (128,0,128)];
const colourPalette = [
  [229, 67, 121],  // RGB for one color
  [203, 1, 11],    // RGB for another color
  [120, 34, 33],   // RGB for another color
  [128, 0, 128]    // RGB for another color
];
const colorKeys = ["flower", "leaves", "endLeaves", "endLeavesStroke"];
let backgroundColor = (20, 24, 82);
let circleRadius,centerSphereSize,endSphereSize,endSphereStroke;
let song,fft;
let numBins = 128;
let smoothing = 0.9;
let button;
let colorVal;
let fireworks = [];
let circles = [];
let shapes = [];
let gravity;
let playing = false;

function preload(params) {
  // song = loadSound('/assets/Dreamcatcher_by_LogicMoon.wav');
  song = loadSound('/assets/Minimal_Loop_by_GIS_Sweden.wav');
}

function setup() { 
  createCanvas(windowWidth, windowHeight);
  background(backgroundColor);

  let minDimension = min(width, height); 
  circleRadius = minDimension / 5;

  initializeFlowers();
  initializeDots();

  fft = new p5.FFT(smoothing, numBins);
  song.connect(fft);
  
  button = createButton("Play/Pause");
  button.position((width - button.width) / 2, height - button.height - 2);

  button.mousePressed(play_pause);

  gravity = createVector(0,0.2);

}

// Main drawing function
function draw() {

  // FFT
  if(fft === undefined) {return}
  let amplitude = fft.getEnergy(20, 20000);
  let centroidFreq = fft.getCentroid();
  let spectrum = fft.analyze();

  colorVal = map(centroidFreq, 0, 22050, 0, 360);
  centerSphereSize = map(amplitude, 0, 255, 0, circleRadius);
  endSphereSize = centerSphereSize/3; // size of the circle in the end of the leaves
  endSphereStroke = endSphereSize/5; // size of the circle stroke in the end of the leaves

  
  background(0,60)

  drawFlowers(); 
  drawDots();


  let flag = false;
  for (let i = 20; i < 40; i++) {
    if(spectrum[i]>100){
      flag = true;
    }
  }
  if(flag){
    if(random()<0.1){
      fireworks.push(new Firework(random(-5,map(spectrum[25], 0, 255, -5, -40))))
    }
  }
  for (let i = fireworks.length-1; i >= 0; i-- ) {
    fireworks[i].update();
    fireworks[i].show();
    if(fireworks[i].done()){
      fireworks.splice(i,1);
    }
  }
  noStroke(); // Remove outline
  for (let i = 0; i < spectrum.length; i++) {
    shapes[i].display(spectrum[i] / 255);
  }
}

  
function initializeFlowers() {
  circles = []; // Clear the existing circle data
  const gridSize = width / 5; 
  let rows = ceil(height / gridSize);
  let cols = ceil(width / gridSize);
  
  for (let row = 0; row < 1; row++) {
    for (let col = 0; col < cols; col++) {
      let x = col * gridSize + gridSize/2 + random(-gridSize*0.2,gridSize*0.2);
      let y = row * gridSize + gridSize/2 + random(-gridSize*0.2,gridSize*0.2);
      let leafLength = random(50, 200);
      let leafCount = random(8, 15);

      let colors = Object.fromEntries(
        colorKeys.map(key => [key, colourPalette[floor(random(colourPalette.length))]])
      );
      circles.push(new Flower(x, y, leafLength, leafCount, colors));
    }
  }
  angleMode(DEGREES);
}
  
function drawFlowers() {
  for (let flower of circles) {
    flower.draw();
  }
}
// Util functions
function randomColor() {
  return colourPalette[floor(random(colourPalette.length))];
}
function createRandomDotsAttributes() {
  return {
    x: random(width), // Random X-coordinate
    y: random(height), // Random Y-coordinate
    size: random(5, 10), // Set dot size between 5 and 15
    chosenColor: randomColor(), // Randomly select color from color pallet
     // Random noise offset for unique movement
  };
}

// Initialize background dots
function initializeDots() {
  shapes = [];
  for (let i = 0; i < numBins; i++) {
    let shapeType = random() > 0.5 ? "circle" : "square";
    shapes.push(new RandomShapes(shapeType));
  }
}

// Draw and Move dots
function drawDots() {
      
  //   // Update position using Perlin noise and constrain within boundaries
  //   dots[i].x += map(noise(dots[i].noiseOffset), 0, 1, -2, 2);
  //   dots[i].y += map(noise(dots[i].noiseOffset + 100), 0, 1, -2, 2);

  //   ellipse(dots[i].x, dots[i].y, dots[i].size * 0.5, dots[i].size * 0.5); // Shrink dot size and draw
  //   dots[i].noiseOffset += 0.01; // Increase noise offset for smooth movement
  
  //   // Keep dots within canvas boundaries
  //   if (dots[i].x < 0 || width < dots[i].x || dots[i].y < 0 || height < dots[i].y){
  //     dots.splice(i,1);
  //     dots.push(createRandomDotsAttributes());
  //   }
    
  // }
}
function play_pause() {
  if (song.isPlaying()) {
    song.stop();
    playing = false;
  } else {
    // We can use song.play() here if we want the song to play once
    // In this case, we want the song to loop, so we call song.loop()
    song.loop();
    playing = true;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(backgroundColor);
  initializeFlowers(); // Reinitialize elements for new window size
  initializeDots();

  let minDimension = min(width, height); 
  circleRadius = minDimension / 200;
  button.position((width - button.width) / 2, height - button.height - 2);
}