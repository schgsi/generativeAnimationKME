function setup() {
    createCanvas(windowWidth, 600);
    net = new Network(30, 300);
}
    
function draw() {
    background('#EBFF50');
    net.startNetwork();
    net.drawNetwork();
}

class Fellow {
    constructor(c, p, d) {
      this.SIZE = 40;
      this.c = c;
      this.position = p;
      this.direction = d;
    }
  
    drawFellow() {
          noStroke();
      fill(this.c);
      ellipse(this.position.x, this.position.y, this.SIZE, this.SIZE);
    }
  
    moveFellow() {
      let newPosition = this.position.copy().add(this.direction);
  
      if (newPosition.x - this.SIZE / 2 < (0) || newPosition.x + this.SIZE / 2 > width-(this.SIZE/2)) {
        this.direction.x = -this.direction.x;
      }
  
      if (newPosition.y - this.SIZE / 2 < (0) || newPosition.y + this.SIZE / 2 > height-(this.SIZE/2)) {
        this.direction.y = -this.direction.y;
      }
  
      this.position.add(this.direction);
    }
  
    getPosition() {
      return this.position;
    }
  }
  
  class Network {
    constructor(n, d) {
      this.population = [];
      this.distance = d;
  
      for (let i = 0; i < n; i++) {
        let position = createVector(random(20, width-20), random(20, height-20));
        let direction = this.randomVector(-0.2, 0.2);
  
        this.population.push(new Fellow(color('#D5D5D5'), position, direction));
      }
    }
  
    drawNetwork() {
      for (let i = 0; i < this.population.length; i++) {
        this.population[i].drawFellow();
      }
    }
  
    startNetwork() {
      for (let i = 0; i < this.population.length; i++) {
        this.population[i].moveFellow();
      }
  
      for (let i = 0; i < this.population.length - 1; i++) {
        for (let j = i + 1; j < this.population.length; j++) {
          let v1 = this.population[i].getPosition();
          let v2 = this.population[j].getPosition();
  
          if (v1.dist(v2) < this.distance) {
            let weight = map(v1.dist(v2), 0, this.distance, 3, 0);
            let r = red(this.population[i].c);
            let g = green(this.population[i].c);
            let b = blue(this.population[i].c);
            
            if(weight <= 0.8){
              strokeWeight(1)
            } else {
              strokeWeight(2);
            }
            stroke('#D5D5D5')
            line(v1.x, v1.y, v2.x, v2.y);
          }
        }
      }
    }
  
    randomVector(min, max) {
      let v = createVector();
  
      do {
        v.x = random(min, max);
      } while (v.x < 0.1 && v.x > -0.1);
  
      do {
        v.y = random(min, max);
      } while (v.y < 0.1 && v.y > -0.1);
  
      return v;
    }
  }
  
  let net;
  

  