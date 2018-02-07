class Suumo extends Vehicle {
	constructor (x = 0, y = 0, dna) {
		super(x, y, dna);

		new Audio("sounds/suumo_0.mp3").play();
	}

	get radius () { return 20 }

	get isDead () {
		let isDead = this.health < 0;
		if (isDead) new Audio(`sounds/suumo_${Math.floor(Math.random() * 18)}.mp3`).play();

		return isDead;
	}

	clone () {
		if (random(1) < 0.005) {
			return new Suumo(this.position.x, this.position.y, this.dna);
		} else {
			return null;
		}
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

		resetMatrix();

		image(IMAGE_SUUMO, this.position.x - (this.radius / 2), this.position.y - (this.radius / 2), this.radius, this.radius);

		pop();
	}
}