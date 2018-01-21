class DNA extends Array {
	constructor (foodWeight = 0, poisonWeight = 0, foodPerception = 0, poisonPerception = 0) {
		super(4);

		this[0] = foodWeight,
		this[1] = poisonWeight,
		this[2] = foodPerception,
		this[3] = poisonPerception;
	}
}