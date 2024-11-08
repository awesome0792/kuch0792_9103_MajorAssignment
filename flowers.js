class Flower {
  constructor(x, y, leafLength, leafCount, colors, scale) {
    // Initialize flower properties
    this.x = x; // X position of flower
    this.y = y; // Y position of flower
    this.leafLength = leafLength; // Length of each leaf
    this.leafCount = leafCount; // Number of leaves per flower
    this.colors = colors; // Color set for different parts of the flower
    this.scale = scale; // Scale factor for flower size
  }

  // Method to draw the flower on the canvas
  draw() {
    push();
    translate(this.x, this.y); // Move to flower position
    let angleStep = (360 / this.leafCount) + frameCount / 5; // Rotation angle per leaf, adds slight rotation over time

    // Draw each leaf with an incremental angle
    for (let i = 0; i < this.leafCount; i++) {
      let leaf = new Leaf(angleStep * i, this.leafLength, this.colors); // Create new leaf with specific angle
      leaf.draw(); // Draw leaf
    }

    // Draw the central sphere of the flower
    fill(color(this.colors.flower));
    noStroke();
    circle(0, 0, centerSphereSize * this.scale); // Centered circle for flower core, scaled in size

    pop(); // Restore original drawing state
  }
}

class Leaf {
  constructor(angle, length, colors) {
    // Initialize leaf properties
    this.angle = angle; // Rotation angle for leaf
    this.length = length; // Length of the leaf (for drawing curve)
    this.colors = colors; // Color set for the leaf
  }

  // Method to draw the leaf
  draw() {
    let segments = 15; // Number of segments in the leaf curve
    let px, py; // Positions for curve vertices

    strokeWeight(5); // Set thickness for leaf stem
    stroke(color(this.colors.leaves)); // Set stroke color from colors

    push();
    rotate(this.angle); // Rotate leaf by specified angle
    noFill(); // Ensure stem is not filled

    beginShape();
    // Create a curved leaf shape
    for (let i = 0; i < segments; i++) {
      px = map(i, 0, segments, 0, this.length); // X position for each vertex
      py = sin(i * 10) * 50; // Y position, creates curve based on sine wave
      vertex(px, py);
    }
    endShape();

    // Draw the end of the leaf
    let endLeaf = new EndLeaf(px, py, this.colors); // Create small sphere at leaf tip
    endLeaf.draw(); // Draw the leaf end

    pop(); // Restore original drawing state
  }
}

class EndLeaf {
  constructor(x, y, colors) {
    // Initialize properties for the end of the leaf
    this.x = x; // X position of leaf tip
    this.y = y; // Y position of leaf tip
    this.colors = colors; // Color set for leaf tip and stroke
  }

  // Method to draw the end of the leaf
  draw() {
    fill(color(this.colors.endLeaves)); // Fill color for leaf tip
    strokeWeight(endSphereStroke); // Stroke thickness for leaf tip
    stroke(color(this.colors.endLeavesStroke)); // Stroke color for leaf tip
    ellipse(this.x, this.y, endSphereSize, endSphereSize); // Draw circle at leaf tip
  }
}