
class Particle {
  constructor(x,y,vel,release) {
    this.pos = createVector(x,y);
    this.release = release
    this.lifespan = 255;
    if(this.release){
      this.vel = p5.Vector.random2D();
      this.vel.mult(random(2,10));
    }else{
      this.vel = createVector(0,vel);
    }
    this.acc = createVector(0,0);
    
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
    if(this.release){
      stroke(255,this.lifespan);
      strokeWeight(2);
    }else{
      stroke(255);
      strokeWeight(4);
    }
    point(this.pos.x,this.pos.y);
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