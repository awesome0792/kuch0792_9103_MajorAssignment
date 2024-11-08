class RandomShapes {
  constructor(type) {
    // Initialize shape properties
    this.type = type; // Type of shape: "circle" or "square"
    this.x = random(1); // X position as a fraction of width
    this.y = random(0.2, 1); // Y position as a fraction of height
    this.size = random(0.03, 0.08); // Size as a fraction of canvas dimension
    this.color = color(colourPalette[floor(random(colourPalette.length))]); // Random color from palette
    this.scale = 1; // Scale factor for size
    this.angle = 0; // Initial rotation angle
  }

  // Display function to render the shape on the canvas
  display(scale, volume) {
    this.angle += frameCount / map(volume, 0, 255, 10, 50); // Adjust rotation based on volume
    this.scale = scale; // Update scale based on input

    this.color.setAlpha(90); // Set transparency
    fill(this.color);
    noStroke(); // No outline for shape

    // Calculate actual size based on scale and canvas dimensions
    let minDimension = min(width, height);
    let size = this.size * minDimension * this.scale;
    let x = this.x * width; // Calculate x position in pixels
    let y = this.y * height; // Calculate y position in pixels

    // Draw shape with rotation and translation
    push();
    rectMode(CENTER);
    translate(x, y);
    rotate(this.angle);

    // Draw the specified shape type
    switch (this.type) {
      case "circle":
        ellipse(0, 0, size, size); // Draw circle at origin
        break;
      case "square":
        rect(0, 0, size, size); // Draw square at origin
        break;
    }
    pop();
  }
}

class Particle {
  constructor(x, y, vel, release) {
    // Initialize particle properties
    this.pos = createVector(x, y); // Starting position of the particle
    this.release = release; // Flag for whether particle is in release mode
    this.lifespan = 255; // Particle lifespan (for fading effect)
    this.acc = createVector(0, 0); // Acceleration vector (initially zero)
    this.color = color(colourPalette[floor(random(colourPalette.length))]); // Random color from palette

    // Set velocity depending on whether particle is released
    if (this.release) {
      let max = random(10, 20);
      this.vel = p5.Vector.random2D(); // Random direction
      this.vel.mult(random(2, max)); // Random speed
    } else {
      this.vel = createVector(0, vel); // Vertical launch velocity
    }
  }

  // Apply a force to the particle
  applyForce(force) {
    this.acc.add(force); // Add force to acceleration
  }

  // Update particle position and state
  update() {
    if (this.release) {
      this.vel.mult(0.9); // Apply damping to slow down released particles
      this.lifespan -= 4; // Decrease lifespan for fading
    }
    this.vel.add(this.acc); // Update velocity with acceleration
    this.pos.add(this.vel); // Update position with velocity
    this.acc.mult(0); // Reset acceleration for next frame
  }

  // Render the particle on the canvas
  show() {
    this.color.setAlpha(this.lifespan); // Adjust transparency based on lifespan
    fill(this.color);
    noStroke(); // No outline
    let size = this.release ? 3 : 5; // Smaller size if released
    circle(this.pos.x, this.pos.y, size); // Draw particle as circle
  }

  // Check if the particle is "done" (lifespan is zero)
  done() {
    return this.lifespan < 0;
  }
}

class Firework {
  constructor(vel) {
    // Initialize the main particle (firework) with a launch velocity
    this.firework = new Particle(random(width), height, vel); // Start at random horizontal position at bottom of canvas
    this.exploded = false; // Flag to check if firework has exploded
    this.particles = []; // Array to store explosion particles
  }

  // Update the state of the firework and its particles
  update() {
    if (!this.exploded) {
      // Apply gravity and update position if firework hasn't exploded yet
      this.firework.applyForce(gravity);
      this.firework.update();

      // Check if the firework should explode
      if (this.firework.vel.y >= 0.2) {
        this.exploded = true;
        this.explode();
      }
    }

    // Update each particle in the explosion
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(gravity);
      this.particles[i].update();
      
      // Remove particle if it's done
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }

  // Create explosion particles upon firework explosion
  explode() {
    for (let i = 0; i < 100; i++) {
      // Generate particles spreading from firework's position
      this.particles.push(new Particle(this.firework.pos.x, this.firework.pos.y, this.firework.vel.y, true));
    }
  }

  // Render the firework and explosion particles
  show() {
    if (!this.exploded) {
      this.firework.show(); // Show main firework if it hasn't exploded yet
    }
    // Show each explosion particle
    for (const particle of this.particles) {
      particle.show();
    }
  }

  // Check if the firework and all particles are done
  done() {
    return this.exploded && this.particles.length === 0;
  }
}