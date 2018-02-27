class DNA {
	/**
	 * Generate DNA.
	 * @param {Object} [data={}] Collection of DNA-Data
	 * @param {Male} data.father The human's father
	 * @param {Female} data.mother The human's mother
	 * @param {Number} data.maxHealth The human's maximum value of health
	 */
	constructor (data = {}) {
		this.father = data.father,
		this.mother = data.mother,
		this.maxHealth = data.maxHealth;
	}
}