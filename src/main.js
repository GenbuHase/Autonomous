"use strict";

const vehicles = [];
const food = [];
const poison = [];

let IMAGE_SUUMO = null;

let isPaused = false;

function preload () {
	IMAGE_SUUMO = loadImage("images/suumo.png");
}

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



	if (location.querySort().DEBUG) {
		window.open("./Controller.html", "Controller", [
			`Width=${width / 5 * 3}`,
			`Height=${height / 8 * 3}`,
			
			"Left=0",
			"Top=0"
		].join(", "));
	}
}

function mouseDragged() {
	vehicles.push(new Vehicle(mouseX, mouseY));
}

function keyPressed (event) {
	if (event.keyCode == 32) { //スペースキーを押した
		isPaused = !isPaused;
	}
}

function draw() {
	if (!isPaused) {
		background(51);
		fill(255);

		if (random(1) < 0.1) {
			food.push(createVector(random(width), random(height)));
		}

		if (random(1) < 0.01) {
			poison.push(createVector(random(width), random(height)));
		}

		for (let i = 0; i < food.length; i++) {
			/*fill(0, 255, 0);
			ellipse(food[i].x, food[i].y, 8, 8);*/

			image(IMAGE_SUUMO, food[i].x - 10, food[i].y - 10, 20, 20);
		}

		for (let i = 0; i < poison.length; i++) {
			fill(255, 0, 0);
			ellipse(poison[i].x, poison[i].y, 8, 8);
		}

		for (let i = 0; i < vehicles.length; i++) {
			vehicles[i].boundaries();
			vehicles[i].behaviors(food, poison);
			
			// Call the appropriate steering behaviors for our agents
			// vehicle.seek(food);
			vehicles[i].update();
			vehicles[i].display();

			let newVehicle = vehicles[i].clone();

			if (newVehicle != null) {
				vehicles.push(newVehicle);
			}

			if (vehicles[i].isDead) {
				food.push(createVector(vehicles[i].position.x, vehicles[i].position.y));
				vehicles.splice(i, 1);
			}
		}
	}
}

window.summon = (foodWeight, poisonWeight, foodPerception, poisonPerception) => vehicles.push(new Vehicle(random(width), random(height), new DNA(foodWeight, poisonWeight, foodPerception, poisonPerception)))