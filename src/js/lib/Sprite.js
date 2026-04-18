
export class Sprite {
	#bounds

	constructor(bounds) {
		this.#bounds = bounds
	}

	get bounds() {
		return this.#bounds
	}

	collision(target) {
		return this.#bounds.intersects(target)
	}
}