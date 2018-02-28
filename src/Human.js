class Human {
	static get GENDER () {
		return {
			MALE: "GENDER_MALE",
			FEMALE: "GENDER_FEMALE"
		}
	}



	/**
	 * Creates an instance of Human
	 * 
	 * @memberof Human
	 * @param {Number} [x=0] The human's x-coord
	 * @param {Number} [y=0] The human's y-coord
	 * @param {DNA} dna The human's DNA
	 * @param {Number} age The human's age
	 */
	constructor (x = 0, y = 0, age = 0, dna = new DNA()) {
		this.acceleration = createVector(0, 0);
		this.velocity = createVector(0, -2);
		this.position = createVector(x, y);

		this.age = age,
		this.maxHealth = this.health = dna.maxHealth,
		this.fiance = null,
		this.familyColor = null,
		this.dna = dna;
	}

	get bodySize () { return 4 }
	get bodyColor () { return color(255, 255, 255) }
	get perception () { return 2.0 }

	get gender () { return null }

	/** @type {Food} */
	get currentFood () {
		let currentFood = null,
			currentFoodDistance = Infinity;

		for (let i = FOODS.length - 1; i >= 0; i--) {
			let dist = this.position.dist(FOODS[i]);

			if (dist < this.dna.maxSpeed) {
				this.health += FOODS[i].nutrition;
				FOODS.splice(i, 1);
			} else {
				if (dist < this.perception * 100 && dist < currentFoodDistance) {
					currentFood = FOODS[i];
				}
			}
		}

		return currentFood;
	}

	get isMarried () { return !!(this.fiance && this.familyColor) }
	get isDead () { return this.health < 0 }

	/**
	 * Approaches the target
	 * 
	 * @memberof Human
	 * @param {Vector} moveTo The target I will Approach
	 */
	seek (moveTo) {
		let route = p5.Vector.sub(moveTo, this.position); //A vector pointing from the location to the target
			route.setMag(this.dna.maxSpeed); //Scale to maximum speed

		let force = p5.Vector.sub(route, this.velocity); //Steering = Desired minus velocity
			force.limit(this.dna.maxForce); //Limit to maximum steering force

		this.acceleration.add(force);
	}

	getMostCompatibleWith () {
		let partners = ANIMALS.filter(human => human.gender != this.gender && human.age >= 18),
			result = [null, 0];
			
		for (let i = 0; i < partners.length; i++) {
			let score = 0;

			partners[i].age > this.age ?
				score += (partners[i].age - this.age) * 100 :
			partners[i].age < this.age ?
				score += (partners[i].age - this.age) * -200 :
			score += 500;
		}

		return partners;
	}

	/**
	 * Decides a next action
	 * 
	 * @memberof Human
	 */
	decide () {
		// Updates velocity
		this.velocity.add(this.acceleration);
		// Limits speed
		this.velocity.limit(this.maxSpeed);
		this.position.add(this.velocity);
		// Resets acceleration to 0 each cycle
		this.acceleration.mult(0);

		this.health -= 0.01,
		this.age += 0.008;

		switch (true) {
			case this.age >= 18:
				wander();
				break;

			case !!(this.currentFood):
				this.eat();
				break;

			default:
				this.wander();
				break;
		}
	}

	/**
	 * Gets marriage with my fiance
	 * 
	 * @memberof Human
	 * @param {Human} fiance The human who will marry me
	 * @param {Number} [familyR=255] Red color of familyColor
	 * @param {Number} [familyG=255] Green color of familyColor
	 * @param {Number} [familyB=255] Blue color of familyColor
	 */
	marry (fiance, familyR = 255, familyG = 255, familyB = 255) {
		this.fiance = fiance,
		this.familyColor = color(familyR, familyG, familyB);
	}

	/**
	 * Approaches currentFood to eat
	 * 
	 * @memberof Human
	 */
	eat () {
		this.seek(this.currentFood);
	}

	/**
	 * Wanders to do any actions
	 * 
	 * @memberof Human
	 */
	wander () {
		this.seek(createVector(random(width), random(height)));
	}

	/**
	 * Avoids to be out of stage
	 * 
	 * @memberof Human
	 */
	boundaries () {
		let desired = null; //壁を避ける向きのベクトル(強さ)
		let d = 25; //d = edgeからのdistance

		if (this.position.x < d) {
			//もし左端に近づいたら
			desired = createVector(this.dna.maxSpeed, this.velocity.y);
		} else if (this.position.x > width - d) {
			//もし右端に近づいたら
			desired = createVector(-this.dna.maxSpeed, this.velocity.y);
		}

		if (this.position.y < d) {
			//もし画面上に近づいたら
			desired = createVector(this.velocity.x, this.dna.maxSpeed);
		} else if (this.position.y > height - d) {
			//もし画面下に近づいたら
			desired = createVector(this.velocity.x, -this.dna.maxSpeed);
		}

		//上記の条件(画面端)にいた場合
		if (desired !== null) {
			desired.normalize();
			desired.mult(this.dna.maxSpeed);

			let steer = p5.Vector.sub(desired, this.velocity);
				steer.limit(this.dna.maxForce);

			this.acceleration.add(steer);
		}
	}

	/**
	 * Draws myself
	 * 
	 * @memberof Human
	 */
	draw () {
		//Draws a triangle rotated in the direction of velocity
		let theta = this.velocity.heading() + PI / 2;
		
		push();
		translate(this.position.x, this.position.y);
		rotate(theta);

		noFill();

		/*
		//Draws foodWeight & foodPerception
		stroke(0, 255, 0);
		strokeWeight(3);
		line(0, 0, 0, -this.dna[0] * 25);
		ellipse(0, 0, this.dna[2] * 2, this.dna[2] * 2);
		*/

		//Draws body
		fill(this.bodyColor);
		stroke(this.bodyColor);

		beginShape();
		vertex(-this.bodySize * 2, -this.bodySize * 2);
		vertex(this.bodySize * 2, -this.bodySize * 2);
		vertex(0, this.bodySize);
		endShape(CLOSE);

		//Draws health-Gauge
		let gr = color(0, 255, 0),
			rd = color(255, 0, 0),
			col = lerpColor(rd, gr, this.health);

		fill(col);
		stroke(col);
		strokeWeight(1);

		ellipse(0, this.bodySize * 2, this.bodySize * 2, this.bodySize * 2);

		noFill();

		//Draws that I've been married
		if (this.isMarried) {
			stroke(this.familyColor);
			ellipse(0, 0, this.bodySize * 10, this.bodySize * 10);
		}

		pop();
	}
}