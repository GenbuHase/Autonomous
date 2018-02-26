class Human {
	constructor (x = 0, y = 0, dna) {
		this.position = createVector(x, y);
		this.acceleration = createVector(0, 0);
		this.velocity = createVector(0, -2);

		this.health = 1;

		if (!dna) {
			this.dna = new DNA(random(0, 100));
		} else {
			this.dna = dna;
			
			if (random(1) < Vehicle.MUTATIONRATE) this.dna[0] += random(-0.1, 0.1);
			if (random(1) < Vehicle.MUTATIONRATE) this.dna[1] += random(-0.1, 0.1);
			if (random(2) < Vehicle.MUTATIONRATE) this.dna[2] += random(-10, 10);
			if (random(2) < Vehicle.MUTATIONRATE) this.dna[3] += random(-10, 10);
		}
	}

	get perception () { return 2.0 }

	/**
	 * 行動を決定する
	 */
	decide () {
		if (this.searchFood()) {

		}
	}

	seek (moveTo) {
		let route = p5.Vector.sub(this.position, moveTo);
			route.setMag(this.dna.maxSpeed);

		let force = p5.Vector.sub(route, this.velocity);
			force.limit(this.dna.maxForce);

		this.acceleration.add(force);
	}

	searchFood () {
		let currentFood = null,
			currentFoodDistance = 0;

		for (let i = foods.length - 1; i >= 0; i--) {
			let dist = this.position.dist(foods[i]);

			if (dist < this.perception * 100 && dist < currentFoodDistance) {
				currentFood = foods[i],
				currentFoodDistance = dist;
			}
		}

		return currentFood;
	}

	eat (foods) {
		for (let i = foods.length - 1; i >= 0; i--) {
			let dist = this.position.dist(foods[i]);

			if (dist < this.maxSpeed) {
				this.health += foods[i].nutrition;
				foods.splice(i, 1);
			} else {
				if (dist < this.dna.perception && dist < currentFoodDistance) {

				}
			}
		}
	}
}