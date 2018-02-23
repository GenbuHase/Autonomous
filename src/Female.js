class Female extends Human {
	constructor (x = 0, y = 0, dna) {
		super(x, y, dna);
	}

	get bodyColor () { return color(255, 64, 255) }
}