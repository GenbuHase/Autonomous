class Female extends Human {
	constructor (x = 0, y = 0, dna) {
		super(x, y, dna);
	}

	get gender () { return Human.GENDER.FEMALE }
	get bodyColor () { return color(255, 64, 255) }
}