class Flower {
    constructor(x, y, leafLength, leafCount, colors,scale) {
      this.x = x;
      this.y = y;
      this.leafLength = leafLength;
      this.leafCount = leafCount;
      this.colors = colors;
      this.scale = scale;
    }
  
    draw() {
      push();
      translate(this.x, this.y);
      let angleStep = (360 / this.leafCount) + frameCount/5; // Rotation angle per leaf
  
      // Draw leaves
      for (let i = 0; i < this.leafCount; i++) {
        let leaf = new Leaf(angleStep * i, this.leafLength, this.colors);
        leaf.draw();
      }
  
      // Draw central sphere
      fill(color(this.colors.flower));
      noStroke();
      circle(0, 0, centerSphereSize*this.scale); // Draw central sphere
  
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
  