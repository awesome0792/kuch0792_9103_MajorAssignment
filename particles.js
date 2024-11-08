class RandomShapes{
    constructor(type){
      this.type = type;
      this.x = random(1);
      this.y = random(0.2,1);
      this.size = random(0.03,0.08);
      this.color = color(colourPalette[floor(random(colourPalette.length))]);
      this.scale = 1;
      this.noiseOffset = random(300);
    }
  
    display(scale){
      this.scale = scale;
      fill(this.color);
      noStroke();
      let minDimension = min(width,height);
      let size = this.size * minDimension;
      size = size * this.scale;
  
      let x = this.x * width;
      let y = this.y * height;
  
      switch(this.type){
        case "circle":
          ellipse(x,y,size,size);
          break;
        case "square":
          rect(x,y,size,size);
          break;
      }
    }
  }
class Particle {
  constructor(x,y,vel,release,type) {
    this.type = type;
    this.pos = createVector(x,y);
    this.release = release
    this.lifespan = 255;
    this.acc = createVector(0,0);
    this.color = color(colourPalette[floor(random(colourPalette.length))]);

    if(this.release){
      this.vel = p5.Vector.random2D();
      this.vel.mult(random(2,10));
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
      if(this.type == "circle"){
        circle(this.pos.x,this.pos.y,10);
      }else{
        rect(this.pos.x,this.pos.y,10,10);
      }
    }else{
      circle(this.pos.x,this.pos.y,4);
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
      let shapeType = random() > 0.5 ? "circle" : "square";
      this.particles.push(new Particle(this.firework.pos.x,this.firework.pos.y,this.firework.vel.y,true,shapeType));
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