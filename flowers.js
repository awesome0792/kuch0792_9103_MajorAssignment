class Flower {
    constructor(x, y, r, leafCount, colors) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.leafCount = leafCount;
      this.colors = colors;
    }
  
    draw() {
      push();
      translate(this.x, this.y);
      let angleStep = 360 / this.leafCount; // Rotation angle per leaf
  
      // Draw leaves
      for (let i = 0; i < this.leafCount; i++) {
        let leaf = new Leaf(angleStep * i, this.r, this.colors);
        leaf.draw();
      }
  
      // Draw central sphere
      fill(color(this.colors.flower));
      noStroke();
      ellipse(0, 0, centerSphereSize, centerSphereSize); // Draw central sphere
  
      pop();
    }
  }
  
  class Leaf {
    constructor(angle, length, colors) {
      this.angle = angle;
      this.length = length;
      this.colors = colors;
    }
  
    draw() {
      let segments = 15;
      let px, py;
  
      strokeWeight(5);
      stroke(color(this.colors.leaves));
  
      push();
      rotate(this.angle);
      noFill();
  
      beginShape();
      for (let i = 0; i < segments; i++) {
        px = map(i, 0, segments, 0, this.length);
        py = sin(i * 10) * 50;
        vertex(px, py);
      }
      endShape();
  
      let endLeaf = new EndLeaf(px, py, this.colors);
      endLeaf.draw();
  
      pop();
    }
  }
  
  class EndLeaf {
    constructor(x, y, colors) {
      this.x = x;
      this.y = y;
      this.colors = colors;
    }
  
    draw() {
      fill(color(this.colors.endLeaves));
      strokeWeight(endSphereStroke);
      stroke(color(this.colors.endLeavesStroke));
      ellipse(this.x, this.y, endSphereSize, endSphereSize);
    }
  }
  
  function initializeFlowers() {
    circles = []; // Clear the existing circle data
    const gridSize = width / 5; 
    const rows = ceil(width / gridSize);
    const cols = ceil(height / gridSize);
  
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let x = col * gridSize + random(gridSize * 0.2, gridSize * 0.8);
        let y = row * gridSize + random(gridSize * 0.2, gridSize * 0.8);
        let r = random(50, 100);
        let leafCount = random(8, 15);
        
        let overlapping = false;
        for (let other of circles) {
          let d = dist(x, y, other.x, other.y);
          if (d < r + other.r) {
            overlapping = true;
            break;
          }
        }
  
        if (!overlapping) {
          let colors = Object.fromEntries(
            colorKeys.map(key => [key, colourPalette[floor(random(colourPalette.length))]])
          );
          circles.push(new Flower(x, y, r, leafCount, colors));
        }
      }
    }
    angleMode(DEGREES);
  }
  
  function drawFlowers() {
    for (let flower of circles) {
      flower.draw();
    }
  }