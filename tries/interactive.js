// M_6_1_03
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * more nodes and more springs
 *
 * KEYS
 * r             : reset positions
 * s             : save png
 * p             : save pdf
 */

'use strict';

var sketch = function(p) {
  // an array for the nodes
  var nodeCount = 10;
  var nodes = [];
  // an array for the springs
  var springs = [];

  // dragged node
  var selectedNode = null;

  var nodeDiameter = 16;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(175);
    p.noStroke();

    initNodesAndSprings();
  };

  p.draw = function() {

    p.background(175);

    // let all nodes repel each other
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].attractNodes(nodes);
    }
    // apply spring forces
    for (var i = 0; i < springs.length; i++) {
      springs[i].update();
    }
    // apply velocity vector and update position
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].update();
    }

    if (selectedNode != null) {
      selectedNode.x = p.mouseX;
      selectedNode.y = p.mouseY;
    }

    // draw nodes
    p.stroke(255);
    p.strokeWeight(2);
    for (var i = 0; i < springs.length; i++) {
      p.line(springs[i].fromNode.x, springs[i].fromNode.y, springs[i].toNode.x, springs[i].toNode.y);
    }
    // draw nodes
    p.noStroke();
    for (var i = 0; i < nodes.length; i++) {
      p.fill('#15FF00');
      p.ellipse(nodes[i].x, nodes[i].y, nodeDiameter, nodeDiameter);
      p.fill('#15FF00');
      p.ellipse(nodes[i].x, nodes[i].y, nodeDiameter - 4, nodeDiameter - 4);
    }

  };

  var initNodesAndSprings = function() {
    // init nodes
    nodes = [];

    var rad = nodeDiameter / 2;
    for (var i = 0; i < nodeCount; i++) {
      var newNode = new Node(p.width / 2 + p.random(-200, 200), p.height / 2 + p.random(-200, 200));
      newNode.minX = rad;
      newNode.minY = rad;
      newNode.maxX = p.width - rad;
      newNode.maxY = p.height - rad;
      newNode.radius = 100;
      newNode.strength = -5;
      nodes.push(newNode);
    }

    // set springs randomly
    springs = [];

    for (var j = 0; j < nodes.length - 1; j++) {
      var rCount = p.floor(p.random(1, 2));
      for (var i = 0; i < rCount; i++) {
        var r = p.floor(p.random(j + 1, nodes.length));
        var newSpring = new Spring(nodes[j], nodes[r]);
        newSpring.length = 20;
        newSpring.stiffness = 1;
        springs.push(newSpring);
      }
    }

  };

  p.mousePressed = function() {
    // Ignore anything greater than this distance
    var maxDist = 20;
    for (var i = 0; i < nodes.length; i++) {
      var checkNode = nodes[i];
      var d = p.dist(p.mouseX, p.mouseY, checkNode.x, checkNode.y);
      if (d < maxDist) {
        selectedNode = checkNode;
        maxDist = d;
      }
    }
  };

  p.mouseReleased = function() {
    if (selectedNode != null) {
      selectedNode = null;
    }
  };

  p.keyPressed = function() {
    if (p.key == 's' || p.key == 'S') p.saveCanvas(gd.timestamp(), 'png');

    if (key == 'r' || key == 'R') {
      p.background(255);
      initNodesAndSprings();
    }
  };

};

var myp5 = new p5(sketch);


// --------------------------------------------SPRING-----------------------


var Spring = function(fromNode, toNode, length, stiffness, damping) {
  this.fromNode = fromNode;
  this.toNode = toNode;

  this.length = length || 100;
  this.stiffness = stiffness || 0.6;
  this.damping = damping || 0.9;
};

// ------ apply forces on spring and attached nodes ------
Spring.prototype.update = function() {
  // calculate the target position
  // target = normalize(to - from) * length + from

  var diff = p5.Vector.sub(this.toNode, this.fromNode);
  diff.normalize();
  diff.mult(this.length);
  var target = p5.Vector.add(this.fromNode, diff);

  var force = p5.Vector.sub(target, this.toNode);
  force.mult(0.5);
  force.mult(this.stiffness);
  force.mult(1 - this.damping);

  this.toNode.velocity.add(force);
  this.fromNode.velocity.add(p5.Vector.mult(force, -1));
};

// --------------------------------------------NODE-----------------------

var Node = function(x, y, minX, maxX, minY, maxY) {
  p5.Vector.call(this, x, y, 0);
  this.minX = Number.MIN_VALUE || minX;
  this.maxX = Number.MAX_VALUE || maxX;
  this.minY = Number.MIN_VALUE || minY;
  this.maxY = Number.MAX_VALUE || maxY;
  this.radius = 200; // Radius of impact
  this.ramp = 1; // Influences the shape of the function
  this.strength = -1; // Strength: positive value attracts, negative value repels
  this.damping = 0.5;
  this.velocity = myp5.createVector();
  this.pVelocity = myp5.createVector();
  this.maxVelocity = 10;
};

Node.prototype = Object.create(p5.Vector.prototype);

Node.prototype.attractNodes = function(nodeArray) {
  for (var i = 0; i < nodeArray.length; i++) {
    var otherNode = nodeArray[i];
    // Stop when empty
    if (otherNode === undefined) break;
    // Continue from the top when node is itself
    if (otherNode === this) continue;

    this.attract(otherNode);
  }
};

Node.prototype.attract = function(otherNode) {
  var thisNodeVector = myp5.createVector(this.x, this.y);
  var otherNodeVector = myp5.createVector(otherNode.x, otherNode.y);
  var d = thisNodeVector.dist(otherNodeVector);

  if (d > 0 && d < this.radius) {
    var s = myp5.pow(d / this.radius, 1 / this.ramp);
    var f = s * 9 * this.strength * (1 / (s + 1) + ((s - 3) / 4)) / d;
    var df = thisNodeVector.sub(otherNodeVector);
    df.mult(f);

    otherNode.velocity.x += df.x;
    otherNode.velocity.y += df.y;
  }
};

Node.prototype.update = function() {
  this.velocity.limit(this.maxVelocity);

  this.x += this.velocity.x;
  this.y += this.velocity.y;

  if (this.x < this.minX) {
    this.x = this.minX - (this.x - this.minX);
    this.velocity.x = -this.velocity.x;
  }
  if (this.x > this.maxX) {
    this.x = this.maxX - (this.x - this.maxX);
    this.velocity.x = -this.velocity.x;
  }

  if (this.y < this.minY) {
    this.y = this.minY - (this.y - this.minY);
    this.velocity.y = -this.velocity.y;
  }
  if (this.y > this.maxY) {
    this.y = this.maxY - (this.y - this.maxY);
    this.velocity.y = -this.velocity.y;
  }

  this.velocity.mult(1 - this.damping);
};

Node.prototype.constructor = Node;
