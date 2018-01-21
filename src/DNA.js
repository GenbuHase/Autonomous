class DNA extends Array {
	constructor (foodWeight = 0, poisonWeight = 0, foodPerception = 0, poisonPerception = 0) {
		super(4);

		//foodWeight：foodを取りに行く割合
		this[0] = foodWeight,

		//poisonWeight：poisonを取りに行く割合
		this[1] = poisonWeight,

		//foodPerception：foodを認識する範囲
		this[2] = foodPerception,

		//poisonPerception：poisonを認識する範囲
		this[3] = poisonPerception;
	}
}