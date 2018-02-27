//食物のテクスチャ変更
const CONFIG = {
	BACKGROUND: "#515151"
};

/** @type {Array<Human>} */
const ANIMALS = [];
const FOODS = [];

function setup () {
	createCanvas(windowWidth, windowHeight);

	ANIMALS.push(new Male(random(width), random(height))),
	ANIMALS.push(new Female(random(width), random(height)));

	for (let i = 0; i < 40; i++) {
		FOODS.push(new Food(random(width), random(height)));
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

function mouseDragged () {
	ANIMALS.push(random(2) <= 1 ? new Male(mouseX, mouseY) : new Female(mouseX, mouseY));
}

function draw () {
	background(CONFIG.BACKGROUND);

	if (random(1) < 0.1) FOODS.push(new Food(random(width), random(height)));

	for (let i = 0; i < FOODS.length; i++) {
		fill(0, 255, 0);
		ellipse(FOODS[i].x, FOODS[i].y, 8, 8);
	}

	for (let i = ANIMALS.length - 1; i >= 0; i--) {
		ANIMALS[i].boundaries();

		ANIMALS[i].decide();
		ANIMALS[i].draw();
		
		if (ANIMALS[i].isDead) {
			FOODS.push(new Food(ANIMALS[i].position.x, ANIMALS[i].position.y));
			ANIMALS.splice(i, 1);
		}
	}
}

window.summon = (foodWeight, poisonWeight, foodPerception, poisonPerception) => ANIMALS.push(new Vehicle(random(width), random(height), new DNA(foodWeight, poisonWeight, foodPerception, poisonPerception)))