class DNA {
	/**
	 * Generate DNA.
	 * @param {Object} [data={}] Collection of DNA-Data
	 * @param {Male} data.father The human's father
	 * @param {Female} data.mother The human's mother
	 * @param {Number} data.maxHealth The human's maximum health
	 * @param {Number} data.maxSpeed The human's maximum speed
	 */
	constructor (data = { maxHealth: random(5, 15), maxSpeed: random(3, 7), maxForce: random(0.2, 0.4) }) {
		this.father = data.father,
		this.mother = data.mother,
		this.maxHealth = data.maxHealth,
		this.maxSpeed = data.maxSpeed,
		this.maxForce = data.maxForce;
	}
}