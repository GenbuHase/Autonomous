class Male extends Human {
	constructor (x = 0, y = 0, dna) {
		super(x, y, dna);
	}

	get gender () { return Human.GENDER.MALE }
	get bodyColor () { return color(64, 192, 255) }
}