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
let numBins = 64;
let smoothing = 0.9;
let button;
let colorVal;
let fireworks = [];
let flowers = [];
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
  noStroke(); // Remove outline

  // FFT
  if(fft === undefined) {return}
  let amplitude = fft.getEnergy(20, 20000);
  let centroidFreq = fft.getCentroid();
  let spectrum = fft.analyze();

  colorVal = map(centroidFreq, 0, 22050, 0, 360);
  centerSphereSize = map(amplitude, 0, 255, 0, circleRadius);
  endSphereSize = centerSphereSize/5; // size of the circle in the end of the leaves
  endSphereStroke = endSphereSize/2; // size of the circle stroke in the end of the leaves

  background(0,40)

  for (let flower of flowers) {
    flower.draw();
  }


  noStroke(); // Remove outline

  let flag = true;
  for (let i = 20; i < 30; i++) {
    if(spectrum[i]<150){
      flag = false;
    }
  }
  if(flag){
    if(random()<0.5){
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
  for (let i = 0; i < spectrum.length; i++) {
    shapes[i].display(spectrum[i] / 255,spectrum[i]);
  }
}

  
function initializeFlowers() {
  flowers = []; // Clear the existing circle data
  const gridSize = width / 5; 
  let rows = ceil(height / gridSize);
  let cols = ceil(width / gridSize);
  
  for (let row = 0; row < 1; row++) {
    for (let col = 0; col < cols; col++) {
      let x = col * gridSize + gridSize/2 + random(-gridSize*0.2,gridSize*0.2);
      let y = row * gridSize + gridSize/2 + random(-gridSize*0.2,gridSize*0.2);
      let leafLength = random(50, 200);
      let leafCount = random(8, 15);
      let scale = random(0.4, 1.1);

      let colors = Object.fromEntries(
        colorKeys.map(key => [key, colourPalette[floor(random(colourPalette.length))]])
      );
      flowers.push(new Flower(x, y, leafLength, leafCount, colors,scale));
    }
  }
  angleMode(DEGREES);
}
  
// Initialize background dots
function initializeDots() {
  shapes = [];
  for (let i = 0; i < numBins; i++) {
    let shapeType = random() > 0.5 ? "circle" : "square";
    shapes.push(new RandomShapes(shapeType));
  }
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