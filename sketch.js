const colourPalette = ['#E54379', '#CB010B', '#782221', 'purple'];
const colorKeys = ["flower", "leaves", "endLeaves", "endLeavesStroke"];
let backgroundColor = (20, 24, 82);
let circles = [];
let dots = [];
let circleRadius,centerSphereSize,endSphereSize,endSphereStroke;
let song;
let fft;
let numBins = 128;
let smoothing = 0.9;
let button;
let colorVal;
let fireworks = [];
let gravity;
let playing = false;

function preload(params) {
  song = loadSound('/assets/Dreamcatcher_by_LogicMoon.wav');
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

  colorVal = map(centroidFreq, 0, 22050, 1, -1);
  centerSphereSize = map(amplitude, 0, 255, 0, circleRadius);
  endSphereSize = centerSphereSize/3; // size of the circle in the end of the leaves
  endSphereStroke = endSphereSize/5; // size of the circle stroke in the end of the leaves

  
  if(playing){
    background(backgroundColor*(colorVal),25); // Set background color
  }else{
    background(0);
  }

  
  let ratio = spectrum.length / circles.length;

  for (let i = 0; i < circles.length; i++) {
    leafLength = map(spectrum[i*ratio], 0, 255, circles[i].r*0.5, circles[i].r*2);
    /* 
    INPUT PARAM:
    1, x: x position of the flower
    2, y: y position of the flower
    3, leafCount: number of the flower leaves
    4, leaflength: number of the flower leaves
    5, colors: color pallet for the flower
     */ 
    drawFlowers(circles[i].x, circles[i].y, circles[i].leafCount, leafLength, circles[i].colors); 
  }

  drawDots();


  let flag = false;
  for (let i = 20; i < 40; i++) {
    if(spectrum[i]>130){
      flag = true;
    }
  }
  // 24
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
      let r = random(50, 100);
      let leafCount = random(8, 15);

      let colors = Object.fromEntries(
        colorKeys.map(key => [key, colourPalette[floor(random(colourPalette.length))]])
      );
      circles.push(new Flower(x, y, r, leafCount, colors));
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
    noiseOffset: random(300) // Random noise offset for unique movement
  };
}

// Initialize background dots
function initializeDots() {
  let numDots = int((width*height)/1000);
  dots = [];
  for (let i = 0; i < numDots; i++) {
    dots.push(createRandomDotsAttributes());
  }
}

// Draw and Move dots
function drawDots() {
  noStroke(); // Remove outline
  for (let dot of dots) {
    fill(dot.chosenColor);
      
    // Update position using Perlin noise and constrain within boundaries
    dot.x += map(noise(dot.noiseOffset), 0, 1, -2, 2);
    dot.y += map(noise(dot.noiseOffset + 100), 0, 1, -2, 2);

    ellipse(dot.x, dot.y, dot.size * 0.5, dot.size * 0.5); // Shrink dot size and draw
    dot.noiseOffset += 0.01; // Increase noise offset for smooth movement
  
    // Keep dots within canvas boundaries
    if (dot.x < 0 || width < dot.x || dot.y < 0 || height < dot.y){
      dot = createRandomDotsAttributes();
    }
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