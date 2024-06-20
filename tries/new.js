class Fellow {
    constructor(c, p, d) {
      this.SIZE = 50;
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
  
      if (newPosition.x - this.SIZE / 2 < 0 || newPosition.x + this.SIZE / 2 > width) {
        this.direction.x = -this.direction.x;
      }
  
      if (newPosition.y - this.SIZE / 2 < 0 || newPosition.y + this.SIZE / 2 > height) {
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
        let position = createVector(random(0, width), random(0, height));
        let direction = this.randomVector(-0.2, 0.2);
  
        if (random(1) < 0.5) {
          this.population.push(new Fellow(color('#15FF00'), position, direction));
        } else {
          this.population.push(new Fellow(color('#FFFFFF'), position, direction));
        }
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
  
            strokeWeight(weight*2);
                      stroke(255, 5)
            //stroke(map(v1.dist(v2), 0, this.distance, r, 0), map(v1.dist(v2), 0, this.distance, g, 0), map(v1.dist(v2), 0, this.distance, b, 0));
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
  
  function setup() {
    createCanvas(windowWidth, 600);
    net = new Network(10, 500);
    background(175);
  }
  
  function draw() {
      net.startNetwork();
    net.drawNetwork();
  }
  