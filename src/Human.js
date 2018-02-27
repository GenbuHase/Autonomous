class Human {
	/**
	 * Generate Human
	 * @param {Number} [x=0] The human's x-coord
	 * @param {Number} [y=0] The human's y-coord
	 * @param {DNA} dna The human's DNA
	 */
	constructor (x = 0, y = 0, dna = new DNA()) {
		this.acceleration = createVector(0, 0);
		this.velocity = createVector(0, -2);
		
		this.position = createVector(x, y);
		this.dna = dna;

		this.health = this.dna.maxHealth;
	}

	get radius () { return 4 }
	get bodyColor () { return color(255, 255, 255) }
	get perception () { return 2.0 }

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

	get isDead () { return this.health < 0 }

	/**
	 * Decide a next action.
	 */
	decide () {
		// Update velocity
		this.velocity.add(this.acceleration);
		// Limit speed
		this.velocity.limit(this.maxSpeed);
		this.position.add(this.velocity);
		// Reset acceleration to 0 each cycle
		this.acceleration.mult(0);

		this.health -= 0.01;

		if (this.currentFood) {
			this.eat();
		}
	}

	/**
	 * Approach the target
	 * @param {Vector} moveTo The target human will Approach
	 */
	seek (moveTo) {
		let route = p5.Vector.sub(moveTo, this.position); //A vector pointing from the location to the target
			route.setMag(this.dna.maxSpeed); //Scale to maximum speed

		let force = p5.Vector.sub(route, this.velocity); //Steering = Desired minus velocity
			force.limit(this.dna.maxForce); //Limit to maximum steering force

		this.acceleration.add(force);
	}

	/**
	 * Avoid to be out of stage
	 */
	boundaries () {
		let desired = null; // 壁を避ける向きのベクトル(強さ)
		let d = 25; // d = edgeからのdistance

		if (this.position.x < d) {
			// もし左端に近づいたら
			desired = createVector(this.dna.maxSpeed, this.velocity.y);
		} else if (this.position.x > width - d) {
			//もし右端に近づいたら
			desired = createVector(-this.dna.maxSpeed, this.velocity.y);
		}

		if (this.position.y < d) {
			// もし画面上に近づいたら
			desired = createVector(this.velocity.x, this.dna.maxSpeed);
		} else if (this.position.y > height - d) {
			// もし画面下に近づいたら
			desired = createVector(this.velocity.x, -this.dna.maxSpeed);
		}

		// 上記の条件(画面端)にいた場合
		if (desired !== null) {
			desired.normalize();
			desired.mult(this.dna.maxSpeed);

			let steer = p5.Vector.sub(desired, this.velocity);
				steer.limit(this.dna.maxForce);

			this.acceleration.add(steer);
		}
	}

	/**
	 * Approach currentFood to eat
	 */
	eat () {
		this.seek(this.currentFood);

		/*for (let i = foods.length - 1; i >= 0; i--) {
			let dist = this.position.dist(foods[i]);

			if (dist < this.maxSpeed) {
				this.health += foods[i].nutrition;
				foods.splice(i, 1);
			} else {
				if (dist < this.dna.perception && dist < currentFoodDistance) {

				}
			}
		}*/
	}

	/**
	 * Draw myself.
	 */
	draw () {
		// Draw a triangle rotated in the direction of velocity
		let theta = this.velocity.heading() + PI / 2;
		
		push();
		translate(this.position.x, this.position.y);
		rotate(theta);

		noFill();

		/*
		//Draw foodWeight & foodPerception
		stroke(0, 255, 0);
		strokeWeight(3);
		line(0, 0, 0, -this.dna[0] * 25);
		ellipse(0, 0, this.dna[2] * 2, this.dna[2] * 2);
		*/

		//Draw body
		fill(this.bodyColor);
		stroke(this.bodyColor);

		beginShape();
		vertex(-this.radius, -this.radius * 2);
		vertex(this.radius, -this.radius * 2);
		vertex(0, this.radius);
		endShape(CLOSE);

		//Draw health-Gauge
		let gr = color(0, 255, 0),
			rd = color(255, 0, 0),
			col = lerpColor(rd, gr, this.health);

		fill(col);
		stroke(col);
		strokeWeight(1);

		ellipse(0, this.radius * 2, this.radius * 2, this.radius * 2);

		noFill();

		//Draw isMarried
		if (this.familyColor) {
			stroke(this.familyColor);
			ellipse(0, 0, this.radius * 10, this.radius * 10);
		}

		pop();
	}
}