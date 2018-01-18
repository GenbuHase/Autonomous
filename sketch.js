"use strict";

const vehicles = [];
const food = [];
const poison = [];

function setup() {
	createCanvas(windowWidth, windowHeight);

	for (let i = 0; i < 10; i++) {
		vehicles[i] = new Vehicle(random(width), random(height));
	}

	for (let i = 0; i < 40; i++) {
		food.push(createVector(random(width), random(height)));
	}

	for (let i = 0; i < 20; i++) {
		poison.push(createVector(random(width), random(height)));
	}
}

function mouseDragged() {
	vehicles.push(new Vehicle(mouseX, mouseY));
}

function draw() {
	background(51);
	fill(255);

	if (random(1) < 0.1) {
		var x = random(width);
		var y = random(height);
		food.push(createVector(x, y));
	}

	if (random(1) < 0.01) {
		var x = random(width);
		var y = random(height);
		poison.push(createVector(x, y));
	}


	for (let i = 0; i < food.length; i++) {
		fill(0, 255, 0);
		ellipse(food[i].x, food[i].y, 8, 8);
	}

	for (let i = 0; i < poison.length; i++) {
		fill(255, 0, 0);
		ellipse(poison[i].x, poison[i].y, 8, 8);
	}

	for (var i = vehicles.length - 1; i >= 0; i--) {
		vehicles[i].boundaries();
		vehicles[i].behaviors(food, poison);
		// Call the appropriate steering behaviors for our agents
		// vehicle.seek(food);
		vehicles[i].update();
		vehicles[i].display();

		var newVehicle = vehicles[i].clone();

		if (newVehicle != null) {
			vehicles.push(newVehicle);
		}

		if (vehicles[i].isDead) {
			var x = vehicles[i].position.x;
			var y = vehicles[i].position.y;
			
			food.push(createVector(x, y));
			vehicles.splice(i, 1);
		}
	}
}
