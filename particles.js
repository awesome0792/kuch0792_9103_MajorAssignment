class RandomShapes{
    constructor(type){
      this.type = type;
      this.x = random(1);
      this.y = random(0.2,1);
      this.size = random(0.03,0.08);
      this.color = color(colourPalette[floor(random(colourPalette.length))]);
      this.scale = 1;
      this.angle = 0;
    }
  
    display(scale,volume){
      this.angle += frameCount/map(volume,0,255,10,50); // Rotation angle per leaf
      this.scale = scale;
      this.color.setAlpha(90);
      fill(this.color);
      noStroke();
      let minDimension = min(width,height);
      let size = this.size * minDimension;
      size = size * this.scale;
  
      let x = this.x * width;
      let y = this.y * height;

      push();
      rectMode(CENTER);
      translate(x,y);
      rotate(this.angle);
  
      switch(this.type){
        case "circle":
          ellipse(0,0,size,size);
          break;
        case "square":
          rect(0,0,size,size);
          break;
      }
      pop();
    }
  }
class Particle {
  constructor(x,y,vel,release) {
    this.pos = createVector(x,y);
    this.release = release
    this.lifespan = 255;
    this.acc = createVector(0,0);
    this.color = color(colourPalette[floor(random(colourPalette.length))]);

    if(this.release){
      let max = random(10,20);
      this.vel = p5.Vector.random2D();
      this.vel.mult(random(2,max));
    }else{
      this.vel = createVector(0,vel);
    }
    
  }
  applyForce(force){
    this.acc.add(force)
  }
  update() {
    if(this.release){
      this.vel.mult(0.9);
      this.lifespan -= 4;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel)
    this.acc.mult(0);
  }
  show(){
    this.color.setAlpha(this.lifespan);
    fill(this.color);
    noStroke();
    if(this.release){
      circle(this.pos.x,this.pos.y,3);
    }else{
      circle(this.pos.x,this.pos.y,5);
    }
  }
  done(){
    if(this.lifespan < 0){
      return true;
    }else{
      return false;
    }
  }
}

class Firework {
  constructor(vel){
    this.firework = new Particle(random(width),height,vel);
    this.exploded = false;
    this.particles = [];
  }

  update(){
    if(!this.exploded){
      this.firework.applyForce(gravity);
      this.firework.update();
      if(this.firework.vel.y >= 0.2){
        this.exploded = true;
        this.explode();
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(gravity);
      this.particles[i].update();
      if(this.particles[i].done()){
        this.particles.splice(i,1);
      }
    }
  }

  explode(){
    for (let i = 0; i < 100; i++) {
      this.particles.push(new Particle(this.firework.pos.x,this.firework.pos.y,this.firework.vel.y,true));
    }
  }
  show(){
    if(!this.exploded){
      this.firework.show();
    }
    for (const particle of this.particles) {
      particle.show();
    }
  }

  done(){
    if(this.exploded && this.particles.length === 0){
      return true;
    }else{
      return false;
    }
  }
}