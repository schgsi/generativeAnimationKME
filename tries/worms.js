let heading;
let x;
let y;
let speed = 8;
let thickness = 50;

let r = 128;
let g = 255;
let b = 128;

let prevLeftX;
let prevLeftY;
let prevRightX;
let prevRightY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(600);
  background(255);


  // Initialize the position and heading
  x = width / 2;
  y = height / 2;
  heading = random(360);

  // Initialize previous positions
  prevLeftX = x;
  prevLeftY = y;
  prevRightX = x;
  prevRightY = y;
}

function draw() {
    background(255)

  heading += sin(radians(frameCount))*2 + random(-10,10);

  r += random(-5, 5);
  g += random(-5, 5);
  b = constrain(b, 0, 256);

  r = constrain(r, 0, 256);
  g = constrain(g, 0, 256);
  b += random(-10, 10);

  x += cos(radians(heading))*speed;
  y += sin(radians(heading))*speed;

  if (x < 0) {
    x = width;
    prevLeftX += width;
    prevRightX += width;
  }
  if (x > width) {
    x = 0;
    prevLeftX -= width;
    prevRightX -= width;
  }

  if (y < 0) {
    y = height;
    prevLeftY += height;
    prevRightY += height;
  }
  if (y > height) {
    y = 0;
    prevLeftY -= height;
    prevRightY -= height;
  }


  let leftX = x + cos(radians(heading-90))*thickness;
  let leftY = y + sin(radians(heading-90))*thickness;

  let rightX = x + cos(radians(heading+90))*thickness;
  let rightY = y + sin(radians(heading+90))*thickness;

  stroke(r,g,b);
  strokeWeight(50);
  fill(r, g, b);
  
  beginShape(POINTS);
  vertex(prevLeftX, prevLeftY);
  vertex(leftX, leftY);
  vertex(rightX, rightY);
  vertex(prevRightX, prevRightY);
  endShape();

  prevLeftX = leftX;
  prevLeftY = leftY;
  prevRightX = rightX;
  prevRightY = rightY;
}