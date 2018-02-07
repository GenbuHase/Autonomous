const MUTATIONRATE = 0.01;

class Vehicle {
	constructor (x = 0, y = 0, dna) {
		this.position = createVector(x, y);
		this.acceleration = createVector(0, 0);
		this.velocity = createVector(0, -2);

		this.health = 1;

		if (!dna) {
			this.dna = new DNA(random(-2, 2), random(-2, 2), random(0, 100), random(0, 100));
		} else {
			this.dna = dna;
			
			if (random(1) < MUTATIONRATE) this.dna[0] += random(-0.1, 0.1);
			if (random(1) < MUTATIONRATE) this.dna[1] += random(-0.1, 0.1);
			if (random(2) < MUTATIONRATE) this.dna[2] += random(-10, 10);
			if (random(2) < MUTATIONRATE) this.dna[3] += random(-10, 10);
		}
	}

	get radius () { return 4 }
	get maxSpeed () { return 5 }
	get maxForce () { return 0.5 }
	get isDead () { return this.health < 0 }

	// Method to update location
	update () {
		this.health -= 0.01;

		// Update velocity
		this.velocity.add(this.acceleration);
		// Limit speed
		this.velocity.limit(this.maxSpeed);
		this.position.add(this.velocity);
		// Reset accelerationelertion to 0 each cycle
		this.acceleration.mult(0);
	}

	behaviors (good, bad) {
		let steerG = this.eat(good, 0.3, this.dna[2]),
			steerB = this.eat(bad, -0.7, this.dna[3]);

		steerG.mult(this.dna[0]);
		steerB.mult(this.dna[1]);

		this.applyForce(steerG);
		this.applyForce(steerB);
	}

	applyForce (force) {
		// We could add mass here if we want A = F / M
		this.acceleration.add(force);
	}

	clone () {
		if (random(1) < 0.005) {
			return new Vehicle(this.position.x, this.position.y, this.dna);
		} else {
			return null;
		}
	}

	eat (list, nutrition, perception) {
		let record = Infinity;
		let closest = null;

		for (let i = list.length - 1; i >= 0; i--) {
			let d = this.position.dist(list[i]);

			if (d < this.maxSpeed) {
				list.splice(i, 1);
				this.health += nutrition;
			} else {
				if (d < record && d < perception) {
					record = d;
					closest = list[i];
				}
			}
		}

		// This is the moment of eating

		if (closest != null) {
			return this.seek(closest);
		}

		return createVector(0, 0);
	}

	// A method that calculates a steering force towards a target
	// STEER = DESIRED MINUS VELOCITY
	seek (target) {
		let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

		// Scale to maximum speed
		desired.setMag(this.maxSpeed);

		// Steering = Desired minus velocity
		let steer = p5.Vector.sub(desired, this.velocity);
		steer.limit(this.maxForce); // Limit to maximum steering force

		return steer;
		// this.applyForce(steer);
	}

	display () {
		// Draw a triangle rotated in the direction of velocity
		let theta = this.velocity.heading() + PI / 2;
		
		push();
		translate(this.position.x, this.position.y);
		rotate(theta);

		noFill();
		stroke(0, 255, 0);
		strokeWeight(3);

		line(0, 0, 0, -this.dna[0] * 25);
		ellipse(0, 0, this.dna[2] * 2, this.dna[2] * 2);

		stroke(255, 0, 0);
		strokeWeight(2);

		line(0, 0, 0, -this.dna[1] * 25);
		ellipse(0, 0, this.dna[3] * 2, this.dna[3] * 2);

		let gr = color(0, 255, 0);
		let rd = color(255, 0, 0);
		let col = lerpColor(rd, gr, this.health);

		fill(col);
		stroke(col);
		strokeWeight(1);

		beginShape();
		vertex(0, -this.radius * 2);
		vertex(-this.radius, this.radius * 2);
		vertex(this.radius, this.radius * 2);
		endShape(CLOSE);

		pop();
	}

	boundaries () {
		let desired = null;
		let d = 25;

		if (this.position.x < d) {
			desired = createVector(this.maxSpeed, this.velocity.y);
		} else if (this.position.x > width - d) {
			desired = createVector(-this.maxSpeed, this.velocity.y);
		}

		if (this.position.y < d) {
			desired = createVector(this.velocity.x, this.maxSpeed);
		} else if (this.position.y > height - d) {
			desired = createVector(this.velocity.x, -this.maxSpeed);
		}

		if (desired !== null) {
			desired.normalize();
			desired.mult(this.maxSpeed);

			let steer = p5.Vector.sub(desired, this.velocity);
			steer.limit(this.maxForce);
			this.applyForce(steer);
		}
	}
}
