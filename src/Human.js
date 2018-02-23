class Human extends Vehicle {
	constructor (x = 0, y = 0, dna) {
		super(x, y, dna);

		this.health = 10;
	}

	get bodyColor () { return color(255, 255, 255) }

	clone () {
		if (random(1) < 0.005) {
			return new Female(this.position.x, this.position.y, this.dna);
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

		/*//Draw foodWeight & foodPerception
		stroke(0, 255, 0);
		strokeWeight(3);
		//line(0, 0, 0, -this.dna[0] * 25);
		ellipse(0, 0, this.dna[2] * 2, this.dna[2] * 2);

		//Draw poisonWeight & poisonPerception
		stroke(255, 0, 0);
		strokeWeight(2);
		//line(0, 0, 0, -this.dna[1] * 25);
		ellipse(0, 0, this.dna[3] * 2, this.dna[3] * 2);*/

		//Draw body
		fill(this.bodyColor);
		stroke(this.bodyColor);

		beginShape();
		vertex(-this.radius, -this.radius * 2);
		vertex(this.radius, -this.radius * 2);
		vertex(0, this.radius);
		endShape(CLOSE);

		//Draw health-Gauge
		let gr = color(0, 255, 0);
		let rd = color(255, 0, 0);
		let col = lerpColor(rd, gr, this.health);
		
		fill(col);
		stroke(col);
		strokeWeight(1);

		ellipse(0, this.radius * 2, this.radius * 2, this.radius * 2);

		pop();
	}
}